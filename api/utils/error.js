export const errorHandler = (message, statusCode) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message || "An unexpected error occurred";
  return error;
};

// // Middleware to handle errors
// export const handleErrors = (err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({ success: false, message: err.message });
// };
