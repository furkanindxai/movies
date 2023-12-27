import bcrypt from "bcrypt"

import hashPassword from "../helpers/hashPassword.js"
import User from "../model/user.js"

const deleteUser = (req, res, next) => {
    try {
        if (req.roles.includes("admin")) throw new Error("Can't delete as you are the admin. Please contact the developer!")
        const error = User.deleteUser(req.id)
        if (error) throw new Error(error.error)
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}

const deleteUserByAdmin = (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id);
        const isAdmin = req.roles.includes("admin")
        if (!isAdmin) {
            throw new Error("Require admin privileges to delete!")
        }
        else {
            if (id === req.id) throw new Error("Can't delete as you are the admin. Please contact the developer!")
            const error = User.deleteUser(id)
            if (error) throw new Error(error.error)
            res.sendStatus(204)

        }
    }
    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}

const getUserMovies = (req, res, next) => {
    try {
        const id = req.id;
        let movies = User.getUserMovies(id)
        movies = movies.filter(movie=>movie.show)
        movies = movies.map(movie=>{
            delete movie.show
            return movie
        })
        res.status(200).json({movies})
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
}

const updatePassword = (req, res, next) => {
    try {
        const id = req.id;
        const {password, confirmPassword, newPassword} = req.body;
        if (!password || !confirmPassword || !newPassword) throw new Error("All fields are required!")
        else if (newPassword !== confirmPassword) throw new Error("Passwords dont match!");
        else {
            const users = User.loadUsers(); 
            let user = users.find((user) => user.id === id)
            if (!user) throw new Error("User doesnt exist!");
            else {
                if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect password!")
                else {
                    if (newPassword.lenght < 4) throw new Error("Password length has to be at least 4!")
                    const hashedPw = hashPassword(newPassword)
                    user.password = hashedPw;
                    const newUsers = users.map(userFromArray=> {
                        if (userFromArray.id === id) return user
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

const activateAccount = (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        const roles = req.roles;
        if (!roles.includes("admin")) throw new Error("Contact the admin to activate your account!");
        else {
            const user = User.getUser(id)
            if (user) {
                user.active = true;
                let users = User.loadUsers();
                
                users = users.map(userFromArray=>{
                    if (userFromArray.id === id) return user
                    return userFromArray
                })
                User.saveUsers(users);
                res.sendStatus(204)
            }
            else {
                throw new Error("User couldnt be find!")
            
            }
        }

    }
    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}


const getUsers = (req, res, next) => {
    try {
        const {active} = (req.query.active === "true") ? true : (req.query.active === "false") ? false: true

        if (!req.roles.includes("admin")) throw new Error("Only admin can see the list of deleted users!")
        const users = User.loadUsers()
        if (!active) {
            const inactiveUsers = users.filter(user=>!user.active)
            res.status(200).json({inactiveUsers})
        }
    }
    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}

export default {deleteUser, getUserMovies, updatePassword, deleteUserByAdmin, activateAccount, getUsers}