import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    parking: {
        type: Boolean,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true,
    },
    offer: {
        type: Boolean,
        required: true,
    },
    beds: {
        type: Number,
        required: true,
    },
    baths: {
        type: Number,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Listing = mongoose.model('Listing', ListingSchema);

export default Listing;