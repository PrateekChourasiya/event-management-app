const AppError = require('../utils/AppError');

/**
 * Global Error Handling Middleware.
 * Must have exactly 4 parameters — Express recognizes it as an error handler.
 * Registered LAST in index.js after all routes.
 */
const errorHandler = (err, req, res, next) => {
    // Default to 500 if no statusCode is set
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose CastError (e.g., invalid ObjectId format in URL params)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value for field: ${err.path}`;
    }

    // Handle Mongoose ValidationError (schema-level validations)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors).map(e => e.message);
        message = `Validation failed: ${errors.join(', ')}`;
    }

    // Handle Mongoose duplicate key errors (e.g., unique email)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `A user with that ${field} already exists.`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    // In production, don't leak internal error details for unexpected crashes
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(statusCode).json({
        success: false,
        message,
        // Only show stack trace in development
        ...(isDev && !err.isOperational && { stack: err.stack }),
    });
};

module.exports = errorHandler;
