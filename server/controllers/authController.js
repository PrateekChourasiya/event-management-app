const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validate = require('../utils/validate');

const register = async(req, res) => {
    try{
        validate(req.body);
        const {userName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);

        const token = jwt.sign({_id: user._id, emailId: emailId, role:'user'}, process.env.JWT_KEY, {expiresIn: 60*60}); // expiresIn takes time in seconds, so we gave 1 hr

        const reply = {
            userName: user.userName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        res.cookie('token', token, {
            maxAge: 60*60*1000
        }); // here maxAge takes time in miliseconds, so we gave time accordingly
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                user: reply,
            }
        });

    } catch(err){
        res.status(400).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const login = async(req, res) => {
    try{
        const {emailId, password} = req.body;

        if(!emailId){
            throw new Error("Invalid Credentials");
        }
        if(!password){
            throw new Error("Invalid Credentials");
        }

        const user = await User.findOne({emailId});

        if(!user){
            throw new Error("Invalid Credentials");
        }

        const match = await bcrypt.compare(password, user.password);

        if(!match){
            throw new Error("Invalid Credentials");
        }

        const reply = {
            userName: user.userName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        const token = jwt.sign({_id: user._id, emailId: emailId, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {
            maxAge: 60*60*1000           
        });

        res.status(201).json({
            success: true,
            message: "User logged in successfully.",
            data: {
                user: reply,
            }
        });
    } catch(err){
        res.status(400).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const logout = async(req, res) => {
    try{
        const {token} = req.cookies;

        const payload = jwt.decode(token);
        
        // delete the cookies
        res.cookie("token", "", {
            expires: new Date(0)
        });        
        res.status(201).json({
            success: true,
            message: "User logged out successfully.",
        });

    } catch(err){
       res.status(503).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const adminRegister = async(req, res) => {
    try{
        // validate the user data first,
        validate(req.body);

        const {emailId, password, role} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = role;

        const user = await User.create(req.body);

        const reply = {
            userName: user.userName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        const token = jwt.sign({_id: user._id, emailId: emailId, role:user.role}, process.env.JWT_KEY, {expiresIn: 60*60}); // expiresIn takes time in seconds, so we gave 1 hr
        res.cookie('token', token, {
            maxAge: 60*60*1000,           
        }); // here maxAge takes time in miliseconds, so we gave time accordingly

        res.status(201).json({
            success: true,
            message: "User registered by admin successfully.",
            data: {
                user: reply,
            }
        });
    }
    catch(err){
        res.status(401).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const deleteProfile = async(req, res) => {
    try{
        const userId = req.result._id;

        // delete user from the user schema
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully."
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error: " + err
        });
    }
}

const getProfile = async(req, res) => {
    try{
        const {id} = req.params;

        if(!id) return res.status(400).send("ID is Invalid/Missing");

        const profile = await User.findById(id).select("_id userName emailId role eventsOrganised eventsAttended eventsOrganisedCount eventsAttendedCount");

        if(!profile) return res.status(400).send("User is Invalid/Missing");

        res.status(200).json({
            success: true,
            data: {
                profile
            }
        });

    } catch(err){
        res.status(400).json({
            success: false,
            message: "Error: " + err
        });
    }
}

module.exports = {register, login, logout, adminRegister, deleteProfile, getProfile}