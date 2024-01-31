import bcrypt from "bcrypt"
import validator from "validator";

import {User} from "../models/index.js";
import generateAccessToken from "../helpers/generateAccessToken.js";
import hashPassword from "../helpers/hashPassword.js";


//controller function for signing up 
const signUp = async (req, res, next) => {
    try {
        let {email, password} = req.body;
        if (!email || !password) throw new Error("Email and password are required!")
        email = email.trim().toLowerCase()
        if (password.length < 4) throw new Error("Password length should be at least 4!")
        if (!validator.isEmail(email)) throw new Error("Invalid email!")
        const hashedPassword = hashPassword(String(password))
        const user = await User.create({email, password: hashedPassword}).catch(
            (error) => {
                throw new Error("Sign up failed!")
            }
        );
        res.status(201).json({message: "Sign up successful! Please sign in to continue."});
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}
//controller function for logging in.
const login = async (req, res, next) => {
    try {
        let {email, password} = req.body
        if (!email || !password) throw new Error("Email and password are required!")
        email = email.trim().toLowerCase()
        if (!validator.isEmail(email)) throw new Error("Invalid email!")
        const user = await User.findOne({ where: { email } });

        const invalidCreds = !user || !bcrypt.compareSync(password, user.password)
            
        if (invalidCreds) throw Error("Invalid credentials!")
        else {
            const roles = user.roles;
            const id = user.id;
            const token = generateAccessToken(email, roles, id)
            res.status(200).json({token, id, email, roles})
        }
    }
    catch (e) {
        console.log(e)
        res.status(401).json({message:e.message})
    }

}

export default {signUp, login}