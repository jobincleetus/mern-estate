import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {errorHandler} from '../utils/error.js'

export const signUp = async (req, res, next) => {
    const {userName, emailId, password} = req.body;
    if(!userName || !emailId || !password) {
        return next(errorHandler(500, 'No valid data'))
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = new User({userName, emailId, password: hashedPassword});
    try {
        await userData.save();
        res.status(200).json('User created successfully')
    } catch (err) {
        next(err);
    }
}

export const signIn = async(req, res, next) => {
    const {emailId, password} = req.body;
    if(!emailId || !password) {
        return next(errorHandler(500, 'No valid data'))
    }
    try {
        const validUser = await User.findOne({emailId});
        if(!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong Credentials'));
        const {password: pass, ...rest} = validUser._doc;
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }
    catch(err) {
        next(err);
    }
}