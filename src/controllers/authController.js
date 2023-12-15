import generateAccessToken from "../helpers/generateAccessToken.js";
import User from "../model/user.js";

import bcrypt from "bcrypt"

const signUp = (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = new User(email, password);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
}

const login = (req, res, next) => {
    try {
        const {email, password} = req.body
        const users = User.loadUsers(); 
        let userAlreadyExists = users.find((user) => user.email === email)
        const invalidCreds = !userAlreadyExists || !bcrypt.compareSync(password, userAlreadyExists.password)
            
        if (invalidCreds) throw Error("Invalid credentials!")
        else {
           
            const token = generateAccessToken(email)
            res.status(200).json({token})
        }
    }
    catch (e) {
        console.log(e)
        res.sendStatus(401)
    }

}

export default {signUp, login}