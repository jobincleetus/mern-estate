import express from "express";
import { createListing, deleteListing, getOneListing, updateListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post('/create', verifyToken, createListing)

router.delete('/delete/:id', verifyToken, deleteListing)

router.get('/get/:id', getOneListing)

router.post('/update/:id', verifyToken, updateListing)

export default router;