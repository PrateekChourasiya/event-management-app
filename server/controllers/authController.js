const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const register = async (req, res, next) => {
    try {
        const { userName, emailId, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ userName, emailId, password: hashedPassword, role: 'user' });

        const token = jwt.sign({ _id: user._id, emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: 60 * 60 });

        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                user: { _id: user._id, userName: user.userName, emailId: user.emailId, role: user.role }
            }
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) return next(new AppError('Invalid credentials', 401));

        const match = await bcrypt.compare(password, user.password);
        if (!match) return next(new AppError('Invalid credentials', 401));

        const token = jwt.sign({ _id: user._id, emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully.',
            data: {
                user: { _id: user._id, userName: user.userName, emailId: user.emailId, role: user.role }
            }
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        res.cookie('token', '', { expires: new Date(0) });
        res.status(200).json({
            success: true,
            message: 'User logged out successfully.'
        });
    } catch (err) {
        next(err);
    }
};

const adminRegister = async (req, res, next) => {
    try {
        const { userName, emailId, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ userName, emailId, password: hashedPassword, role: role || 'admin' });

        const token = jwt.sign({ _id: user._id, emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(201).json({
            success: true,
            message: 'User registered by admin successfully.',
            data: {
                user: { _id: user._id, userName: user.userName, emailId: user.emailId, role: user.role }
            }
        });
    } catch (err) {
        next(err);
    }
};

const deleteProfile = async (req, res, next) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const { id } = req.params;

        const profile = await User.findById(id).select('_id userName emailId role eventsOrganised eventsAttended eventsOrganisedCount eventsAttendedCount');
        if (!profile) return next(new AppError('User not found', 404));

        res.status(200).json({ success: true, data: { profile } });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile, getProfile };