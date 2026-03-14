import prisma from '../config/database.js';
import catchAsyncErrors from '../middlewares/catchAsyncError.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import bcrypt from 'bcryptjs';
import { sendToken } from '../middlewares/authMiddleware.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Register new user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler('Please provide all required fields.', 400));
  }

  if (password.length < 6) {
    return next(new ErrorHandler('Password must be at least 6 characters.', 400));
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return next(new ErrorHandler('User already registered with this email.', 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Get device and location info from request
  const device = req.headers['user-agent'] || 'Unknown Device';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
  const location = req.headers['x-forwarded-for'] || ip;

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      lastLoginDevice: device,
      lastLoginIp: ip,
      lastLoginLocation: location,
    },
  });

  sendToken(user, 201, 'User registered successfully', res);
});

// Login user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password.', 400));
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid email or password.', 401));
  }

  // Check password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Invalid email or password.', 401));
  }

  // Update device and location info
  const device = req.headers['user-agent'] || 'Unknown Device';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
  const location = req.headers['x-forwarded-for'] || ip;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginDevice: device,
      lastLoginIp: ip,
      lastLoginLocation: location,
    },
  });

  sendToken(user, 200, 'Logged in successfully', res);
});

// Logout user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie('token', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// Get current user profile
export const getUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Update password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler('Please provide current and new password.', 400));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler('Current password is incorrect.', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorHandler('New password must be at least 6 characters.', 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.',
  });
});

// Update profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, phone, address, city, state, country, pincode } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (city) updateData.city = city;
  if (state) updateData.state = state;
  if (country) updateData.country = country;
  if (pincode) updateData.pincode = pincode;

  // Handle avatar upload
  if (req.files && req.files.avatar) {
    const avatarFile = req.files.avatar;
    const uploadResult = await uploadToCloudinary(avatarFile.tempFilePath, 'avatars');
    
    // Delete old avatar if exists
    if (req.user.avatar) {
      const publicId = req.user.avatar.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`avatars/${publicId}`);
    }
    
    updateData.avatar = uploadResult.url;
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
    },
  });

  res.status(200).json({
    success: true,
    user,
    message: 'Profile updated successfully.',
  });
});

// Forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler('Please provide your email.', 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new ErrorHandler('User not found with this email.', 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken,
      resetPasswordExpire,
    },
  });

  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  
  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>This link will expire in 30 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    return next(new ErrorHandler('Email could not be sent.', 500));
  }
});

// Reset password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler('Please provide password and confirm password.', 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler('Passwords do not match.', 400));
  }

  if (password.length < 6) {
    return next(new ErrorHandler('Password must be at least 6 characters.', 400));
  }

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken,
      resetPasswordExpire: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid or expired reset token.', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully.',
  });
});

// Get user login history (Admin)
export const getUserLoginHistory = catchAsyncErrors(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      lastLoginDevice: true,
      lastLoginIp: true,
      lastLoginLocation: true,
    },
  });

  res.status(200).json({
    success: true,
    device: user.lastLoginDevice,
    ip: user.lastLoginIp,
    location: user.lastLoginLocation,
  });
});

export default {
  register,
  login,
  logout,
  getUser,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
  getUserLoginHistory,
};

