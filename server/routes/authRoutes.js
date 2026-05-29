const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { validateRequest, registerSchema, loginSchema } = require('../middleware/validateMiddleware');
const { register, login, logout, adminRegister, deleteProfile, getProfile } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/register', validateRequest(registerSchema), register);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.delete('/delete', userMiddleware, deleteProfile);
authRouter.get('/profile/:id', userMiddleware, getProfile);
authRouter.post('/admin/register', adminMiddleware, validateRequest(registerSchema), adminRegister);

module.exports = authRouter;