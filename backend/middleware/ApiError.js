/**
 * Custom API error with an HTTP status code, for controllers that need
 * to signal specific failures (404, 403, ...).
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
