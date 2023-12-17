import express from 'express';
import { deleteUserData, test, updateUserData } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/test', test)

router.post('/update/:id', verifyToken, updateUserData)

router.delete('/delete/:id', verifyToken, deleteUserData)

export default router;