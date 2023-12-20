import express from 'express';
import { getListings } from '../controllers/listing.controller.js';
import { deleteUserData, signout, updateUserData } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUserData)

router.delete('/delete/:id', verifyToken, deleteUserData)

router.get('/signout', signout)

router.get('/listings/:id', verifyToken, getListings)

export default router;