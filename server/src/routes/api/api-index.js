import express from 'express';
import cors from 'cors';
import { authUser } from '../../config/middlewares.js';
import auth from './auth.js'
import actions from "./actions.js";
import profile from './profile.js'
import forms from './forms.js'

const router = express.Router();

router.use(cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Basic Routes
router.use('/auth', auth);

// Auth Only Routes
router.use(authUser);

router.use('/actions', actions);
router.use('/profile', profile);
router.use('/forms', forms);

export default router;