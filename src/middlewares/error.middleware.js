// middleware/error.middleware.js

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // If error is our custom AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown server error
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errorMiddleware;
