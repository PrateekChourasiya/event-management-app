const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) return next(new AppError('Authentication required. Please log in.', 401));

        const payload = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(payload._id);
        if (!user) return next(new AppError('User not found. Please log in again.', 401));

        req.result = user;
        next();
    } catch (err) {
        next(err); // handles JWT errors (JsonWebTokenError, TokenExpiredError) via errorMiddleware
    }
};

module.exports = userMiddleware;