import express from 'express';
import bcrypt from 'bcrypt';
import Forms from '../../models/formModel.js';
import User from '../../models/userModel.js';
import ActivityLog from '../../models/activityLog.js';
import bp from '../../utils/bigPromise.js';
import { Op, fn, col, literal } from 'sequelize';

const router = express.Router();

router.get('/', bp(async (req, res) => {
    const id = req.user.id;
    const user = await User.findByPk(id);
    const forms = await Forms.findAndCountAll({ where: { owner: user.id } });
    const formId = await forms.rows.map(f => f.id);
    const submissions = await ActivityLog.findAll({
        attributes: [
            [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
            [literal('COUNT(*)'), 'count'],
        ],
        where: {
            event: 'form-submit',
            ['meta.id']: {
              [Op.in]: formId,
            }
        },
        group: ['month'],
        raw: true
      });
    res.json({ user: user.toJSON(), submissions }); 
}));

router.post('/', bp(async (req, res) => {
    const { name, bio, username } = req.body;
    const user = await User.findOne({ where: { id: req.user.id }});
    await user.update({ name, bio, username });
    user.reload();
    res.status(201).json({
        message: 'Updated User Successfully',
        refresh: true,
        user: user.toJSON()
    });
}));

router.post('/password-check', bp(async (req, res) => {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id, { attributes: ['password'] });
    res.json({
        match: bcrypt.compareSync(password, user.password)
    });
}));

export default router;