// Error Handler Middleware
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// note: default export is middleware for compatibility
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // minimal implementation to avoid missing during old import usage
  res.status(err.statusCode).json({ success: false, message: err.message });
};

export { ErrorHandler };
export default errorMiddleware;

