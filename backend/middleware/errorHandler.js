/**
 * Global error handler — normalizes Mongoose, JWT, and generic errors
 * into a consistent JSON envelope: { success: false, error: string }.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on our end.';

  // Malformed ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Schema validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
  }

  // Unique index violation (duplicate email or review)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message =
      field === 'email'
        ? 'An account with that email already exists.'
        : 'That value already exists.';
  }

  // Bad JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  if (statusCode === 500) {
    console.error('✗', err);
  }

  res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
