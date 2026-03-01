import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY || "mysecretkey123", {
    expiresIn: process.env.JWT_EXPIRES_IN || "5d",
  });

  // Check if we're in production
  const isProduction = process.env.NODE_ENV === "production";
  
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message,
  });
};
