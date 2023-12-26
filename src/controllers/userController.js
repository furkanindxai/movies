import bcrypt from "bcrypt"

import hashPassword from "../helpers/hashPassword.js"
import User from "../model/user.js"

const deleteUser = (req, res, next) => {
    try {
        const error = User.deleteUser(req.email.email)
        if (error) throw new Error(error.error)
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}

const getUserMovies = (req, res, next) => {
    try {
        const email = req.email.email;
        const movies = User.getUserMovies(email)
        res.status(200).json({movies})
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
}

const updatePassword = (req, res, next) => {
    try {
        const email = req.email.email;
        const {password, confirmPassword, newPassword} = req.body;
        if (!password || !confirmPassword || !newPassword) throw new Error("All fields are required!")
        else if (newPassword !== confirmPassword) throw new Error("Passwords dont match!");
        else {
            const users = User.loadUsers(); 
            let user = users.find((user) => user.email === email)
            if (!user) throw new Error("User doesnt exist!");
            else {
                if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect password!")
                else {
                    if (newPassword.lenght < 4) throw new Error("Password length has to be at least 4!")
                    const hashedPw = hashPassword(newPassword)
                    user.password = hashedPw;
                    const newUsers = users.map(userFromArray=> {
                        if (userFromArray.email === email) return user
                        return userFromArray
                    })
                    User.saveUsers(newUsers)
                    res.sendStatus(204);
                }
            }
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}

export default {deleteUser, getUserMovies, updatePassword}