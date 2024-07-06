import express from 'express';
import bp from '../../utils/bigPromise.js';
import activityLog from '../../models/activityLog.js';

const router = express.Router();

router.get('/', bp(async (req, res, next) => {
    const activities = await activityLog.findAndCountAll({ 
        order: [['createdAt', 'desc']], 
        limit: req.limit,
        offset: req.offset,
    });
    activities.limit = req.limit;
    req.renderData = { data: activities, view: 'activity' }
    next();
}));

export default router;
