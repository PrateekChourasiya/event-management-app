/**
 * Custom operational error class.
 * Allows controllers to throw structured errors with a specific HTTP status code.
 * The global error handler checks `isOperational` to distinguish these from
 * unexpected crashes (programming bugs).
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // mark as a known, intentional error
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
