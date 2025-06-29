export const errorHandler = (message, statusCode) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message || "An unexpected error occurred";
  return error;
};