import prisma from "../config/database.js";
import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import bcrypt from "bcryptjs";
import { sendToken } from "../middlewares/authMiddleware.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


// ================= REGISTER =================
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }

  if (password.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters.", 400));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return next(new ErrorHandler("User already registered with this email.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const device = req.headers["user-agent"] || "Unknown Device";
  const ip = req.ip || "Unknown IP";
  const location = req.headers["x-forwarded-for"] || ip;

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

  user.password = undefined; // 🔐 hide password

  sendToken(user, 201, "User registered successfully", res);
});


// ================= LOGIN =================
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  // update login info
  const device = req.headers["user-agent"] || "Unknown Device";
  const ip = req.ip || "Unknown IP";
  const location = req.headers["x-forwarded-for"] || ip;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginDevice: device,
      lastLoginIp: ip,
      lastLoginLocation: location,
    },
  });

  user.password = undefined; // 🔐 hide password

  sendToken(user, 200, "Logged in successfully", res);
});


// ================= LOGOUT =================
export const logout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});


// ================= GET CURRENT USER =================
export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


// ================= UPDATE PASSWORD =================
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler("Please provide current and new password.", 400));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Current password incorrect.", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});


// ================= FORGOT PASSWORD =================
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expireTime = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: expireTime,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Reset password link: ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message,
  });

  res.status(200).json({
    success: true,
    message: "Reset email sent",
  });
});


// ================= RESET PASSWORD =================
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { gt: new Date() },
    },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
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
    message: "Password reset successful",
  });
});