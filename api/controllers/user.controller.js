import bcrypt from "bcryptjs/dist/bcrypt.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"

export const test = (req, res) => {
    res.json({message: 'Hello from user api'})
}

export const updateUserData = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    if(req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                userName: req.body.userName,
                emailId: req.body.emailId,
                password: req.body.password,
                avatar: req.body.avatar
            }
        },
        {new: true})
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }
    catch(err) {
        next(err);
    }
}

export const deleteUserData = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User account has been deleted');
    } catch(err) {
        next(err);
    }
}