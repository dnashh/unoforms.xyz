import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import api from './api/api-index.js';
import admin from './admin/admin-index.js';
import submit from './submit.js';
import { morganHTTPLoggerOptions, morganFormatter } from '../utils/winston.js';


const router = express.Router();

router.use(morgan(morganFormatter, morganHTTPLoggerOptions));

router.options('*', cors());

router.use('/api', api);
router.use('/admin', admin);
router.use('/submit', submit);

export default router;