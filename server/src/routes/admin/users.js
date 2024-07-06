import express from 'express';
import bp from '../../utils/bigPromise.js';
import User from '../../models/userModel.js';
import { logger } from '../../utils/winston.js';
import { nanoid } from 'nanoid';
import { sendEmail } from '../../utils/postman.js';
import { Op } from 'sequelize';
import Forms from '../../models/formModel.js';
import FormData from '../../models/formDataModel.js';

const router = express.Router();

router.get('/', bp(async (req, res, next) => {
    const users = await User.findAndCountAll({ 
        order: [['last_sign_in', 'DESC']], 
        limit: req.limit,
        offset: req.offset
    });
    users.limit = req.limit;
    req.renderData = { data: users, view: 'users' }
    next();
}));

router.get('/:id', bp(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    const forms = await Forms.findAndCountAll({ where: { owner: user.id } });
    const formId = await forms.rows.map(f => f.id);
    const responses = await FormData.count({ where: { formId } })
    const data = { user, stats: { forms: forms.count, responses } }
    req.renderData = { data, view: 'view-user' }
    next();
}));

router.post('/adduser', bp( async (req, res) => {
    const { name, email, username } = req.body;
    const autoUsername = email.split("@")[0] + "_" + (Math.random() * 100).toString().split(".")[0];
    const userExist = await User.findOne({ where: { [Op.or]: [{email}, {username : username ? username : autoUsername}] } });
    if(userExist){
        throw new Error('User Already Exists. Can\'t Create Account!');
    }
    const forgotPasswordToken = nanoid(64);
    const forgotPasswordTokenExpiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 3600 * 7); // 1 Week
    const user = await User.create({ id: nanoid(), name, email, username : username ? username : autoUsername, forgotPasswordToken, forgotPasswordTokenExpiresAt });
    sendEmail('addUserByAdmin', email, {name, passwordLink: `http://unoforms.xyz/reset-password?token=${forgotPasswordToken}` })
    logger.info(`new-user-created-by-admin #${req.user.id} - #${user.id}`);
    res.redirect('/admin/users');
}));

export default router;
