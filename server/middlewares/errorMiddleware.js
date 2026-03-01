// Simple function to create error objects
export const ErrorHandler = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const errorMiddleware = (err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;

  // PostgreSQL duplicate key
  if (err.code === "23505") {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // JWT invalid
  if (err.name === "JsonWebTokenError") {
    return res.status(400).json({
      success: false,
      message: "JSON Web Token is invalid, try again",
    });
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    return res.status(400).json({
      success: false,
      message: "JSON Web Token has expired, try again",
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default ErrorHandler;
