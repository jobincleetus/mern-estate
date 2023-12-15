import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    const {userName, emailId, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = new User({userName, emailId, password: hashedPassword});
    try {
        const response = await userData.save();
        console.log(response)
        res.status(200).json('User created successfully')
    } catch (err) {
        res.status(500).json(err.message)
    }
}