import express from 'express';
import { test, updateUserData } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/test', test)

router.post('/update/:id', verifyToken, updateUserData)

export default router;