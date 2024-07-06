import express from 'express';
import { allowOnly, authUser, isAuthenticated } from '../../config/middlewares.js';
import renderMan from '../../utils/renderMan.js';
import users from './users.js';
import activity from './activity.js';
import User from '../../models/userModel.js';
import Forms from '../../models/formModel.js';
import FormData from '../../models/formDataModel.js';

const router = express.Router();

router.get('/', isAuthenticated("god", "admin"), async (req, res) => {
    if (!req.auth) {
        res.redirect('/404');
        return;
    }
    const data = {
        Users: await User.count(),
        Forms: await Forms.count(),
        Responses: await FormData.count()
    }
    res.render('root', { view: 'overview', currentUser: req.user, data });
});

// Pagination Middleware
router.use((req, res, next) => {
    const limit = req.query.limit && req.query.limit > 0 ? req.query.limit : 10;
    const page = req.query.page && req.query.page > 0 ? req.query.page : 1;
    req.limit = (limit > 100) ? 100 : limit;
    req.offset = (page - 1) * limit;
    next();
});

// Admin Auth Only Routes
router.use(authUser, allowOnly('admin', 'god'));
router.use('/users', users);
router.use('/activity', activity);

router.use(renderMan);

export default router;