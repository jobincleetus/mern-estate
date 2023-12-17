import express from 'express';
import { deleteUserData, signout, updateUserData } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUserData)

router.delete('/delete/:id', verifyToken, deleteUserData)

router.get('/signout', signout)

export default router;