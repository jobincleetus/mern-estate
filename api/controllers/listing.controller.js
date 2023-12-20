import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const newListing = await Listing.create(req.body)
        res.status(201).json(newListing)
    } catch (err) {
        next(err);
    }
}

export const getListings =  async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, "Not authorized to access this user's listings"))
    }
    try {
        const listings = await Listing.find({userRef: req.params.id});
        res.status(200).json(listings);
    } catch(err) {
        next(err);
    }
}

export const deleteListing =  async (req, res, next) => {
    if(!req.user.id) {
        return next(errorHandler(403, 'Not authorized to delete'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing Deleted Successfully');
    } catch(err) {
        next(err);
    }
}