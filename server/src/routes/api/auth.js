import * as dotenv from 'dotenv'
import express from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import User from '../../models/userModel.js';
import bp from '../../utils/bigPromise.js';
import { authUser } from '../../config/middlewares.js';
import { sendEmail } from '../../utils/postman.js';
import { activityLogger } from '../../utils/functions.js';

dotenv.config();
const router = express.Router();

// Functions

const generateLoginTokens = (user, req, res) => {
    console.log(user, res);
    user.last_sign_in = new Date();
        if(!user.refreshToken || user.refreshTokenExpiresAt > Date.now()){
            user.refreshToken = nanoid(64);
            user.refreshTokenExpiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365) // 1 year
            user.save();
        }
        user = user.toJSON();
        user.password = undefined;
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60, // 1 Hour
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        res.cookie('refreshToken', user.refreshToken, {
            expires: user.refreshTokenExpiresAt,
            sameSite: 'None',
            secure: true
        });
        user.accessToken = accessToken;
        res.json({ user, message: `Logged in as ${user.name}` });
        activityLogger('user-login', user.id, req.ip);
}


// Routes

router.post('/signup', bp(async (req, res) => {
    const { name, email, password } = req.body;
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        throw new Error("Password must be atleast 8 characters long, at least one uppercase letter, one lowercase letter, one number and one special character.")
    }
    const username = email.split("@")[0];
    const userExist = await User.findOne({ where: { email } });
    if(userExist){
        throw new Error('User Already Exists. Try Signing in to your account.');
    }
    const user = await User.create({ id: nanoid(), name, email, username, password });
    res.status(201).json({ user, message: 'New User Created Successfully' });
    activityLogger('user-signup', user.id, req.ip);
}));

router.post('/login', bp(async (req, res) => {
    let user = await User.findOne({
        where: {
            [Op.or]: [
                { email: req.body.login },
                { username: req.body.login }
            ],
        },
        attributes: { include: ['password'] }
    });
    
    if(user && bcrypt.compareSync(req.body.password, user.password)){
        generateLoginTokens(user, req, res);
    } else {
        res.status(401).json({
            error: 'User or Password doesn\'t match'
        });
    }
}));

router.all('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        sameSite: 'None',
        secure: true
    });
    res.clearCookie('refreshToken', {
        sameSite: 'None',
        secure: true
    });
    res.json({
        message: 'Logged Out Successfully'
    });
});

router.all('/refresh', bp(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers.refreshToken?.split(' ')[1];
    if(refreshToken) {
        const user  = await User.findOne({ where: { refreshToken } });
        if(!user) { 
            res.status(404).json({ message: 'User Not Found' }); 
            return;
        }
        req.user = user.toJSON();
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60, // 1 Hour
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        res.cookie('refreshToken', user.refreshToken, {
            expires: user.refreshTokenExpiresAt,
            sameSite: 'None',
            secure: true
        });
        user.accessToken = accessToken;
        res.json({user});
        user.last_sign_in = new Date();
        user.save();
        activityLogger('user-refresh', user.id, req.ip);
    } else {
        res.status(401).json({
            error: 'Unauthorized Request',
            message: 'Invalid Refresh Token'
        });
    }
}));

router.post('/forgot-password', bp(async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ where: { email }, attributes: { include: ['forgotPasswordToken', 'forgotPasswordTokenExpiresAt'] } });
    if(user) {
        const token = nanoid(64);
        user.forgotPasswordToken = token; 
        user.forgotPasswordTokenExpiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 15); // 15 Minutes
        await user.save();
        sendEmail('resetPassword', user.email, { name: user.name, resetLink: `http://unoforms.xyz/reset-password?token=${token}` });
    }
    res.json({
        message: 'Email Sent To address if user exists.'
    });
}));

router.post('/reset-password', bp(async (req, res) => {
    const forgotPasswordToken = req.query.token;
    const user = await User.findOne({ where: { forgotPasswordToken }, attributes: { include: ['password', 'forgotPasswordToken', 'forgotPasswordTokenExpiresAt'] } });
    if(user && user.forgotPasswordTokenExpiresAt > Date.now()) {
        user.password = req.body.password;
        user.emailVerified = true;
        user.forgotPasswordToken = null;
        user.forgotPasswordTokenExpiresAt = null;
        user.refreshToken = null;
        user.refreshTokenExpiresAt = null;
        await user.save();
        res.status(201).json({
            message: 'Password Reset Successful'
        });
    } else {
        res.status(400).json({
            message: 'Invalid Forgot Password Token or Token Expired.'
        });
    }
}));

// Authenticated Route 

router.use(authUser);

router.get('/status', (req, res) => {
    res.json({
        user: req.user
    });    
});

export default router;