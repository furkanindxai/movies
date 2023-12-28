import bcrypt from "bcrypt"

import generateAccessToken from "../helpers/generateAccessToken.js";
import User from "../model/user.js";

//controller function for signing up 
const signUp = (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) throw new Error("Email and password are required!")
        const user = new User(String(email.trim()), String(password));
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}
//controller function for logging in.
const login = (req, res, next) => {
    try {
        const {email, password} = req.body
        if (!email || !password) throw new Error("Email and password are required!")
        const users = User.loadUsers(); 
        let userAlreadyExists = users.find((user) => user.email === email.toLowerCase().trim())
        const invalidCreds = !userAlreadyExists || !bcrypt.compareSync(password, userAlreadyExists.password)
            
        if (invalidCreds) throw Error("Invalid credentials!")
        else {
            const roles = userAlreadyExists.roles;
            const id = userAlreadyExists.id;
            if (!userAlreadyExists.active) throw new Error("Please contact admin to reactivate your account!")
            const token = generateAccessToken(email, roles, id)
            res.status(200).json({token})
        }
    }
    catch (e) {
        console.log(e)
        res.status(401).json({message:e.message})
    }

}

export default {signUp, login}