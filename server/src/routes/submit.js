import express from 'express';
import { submitFormData } from '../config/commonController.js';

const router = express.Router();

router.post('/:id', submitFormData)

export default router;