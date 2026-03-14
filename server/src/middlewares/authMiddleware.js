import jwt from 'jsonwebtoken';
import catchAsyncErrors from './catchAsyncError.js';
import { ErrorHandler } from './errorMiddleware.js';
import prisma from '../config/database.js';

// Check if user is authenticated
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please login to access this resource.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user) {
      return next(new ErrorHandler('User not found.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid token. Please login again.', 401));
  }
});

// Authorize specific roles
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role '${req.user.role}' is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

// Generate JWT Token
export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
    message,
  });
};

export default {
  isAuthenticated,
  authorizedRoles,
  sendToken,
};

