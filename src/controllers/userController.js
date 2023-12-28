import bcrypt from "bcrypt"

import hashPassword from "../helpers/hashPassword.js"
import User from "../model/user.js"
import paginate from "../helpers/paginate.js"

//controller function for soft deleting a user
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
//controller function that allows user account deletion by admin
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
//controller function that retrieves user rated movies
const getUserMovies = (req, res, next) => {
    try {
        const id = req.id;
        let {limit, offset} = req.query;
        if (limit && !offset || offset && !limit) throw new Error("Limit and offset are both required!")
        let movies = User.getUserMovies(id)
        if (limit && offset) {
            limit = Number(limit)
            offset = Number(offset)
            movies = paginate(movies, "none", 0, offset, limit)
        }
        movies = movies.filter(movie=>!movie.deleted)
        movies = movies.map(movie=>{
            delete movie.deleted
            return movie
        })
        res.status(200).json({movies})
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
}
//controller function for password updation.
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
//controller function that allows reactivation of account by admin.
const restoreAccount = (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        const roles = req.roles;
        if (!roles.includes("admin")) throw new Error("Contact the admin to activate your account!");
        else {
            const user = User.getUser(id)
            if (user) {
                user.deleted = false;
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

//function for getting users based on query params, only for admin.
const getUsers = (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) throw new Error("Only admin can see the list of users!")
        let users = User.loadUsers()
        const deleted = (req.query.deleted === "true") ? true : (req.query.deleted === "false") ? false: undefined

        if (deleted) users = users.filter(user=>user.deleted)
        else if (deleted === undefined) users = users
        else users = users.filter(user=>!user.deleted)
        let {offset, limit} = req.query
        if (offset && !limit || limit && !offset) throw new Error("Please provide both offset and limit!")
        else if (limit && offset) {
            offset = Number(offset)
            limit = Number(limit)
            users = paginate(users, "deleted", deleted, offset, limit)
        }
        users = users.map(user=>{
            delete user.deleted
            return user
        })
        res.status(200).json({users})
    }
    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}

export default {deleteUser, getUserMovies, updatePassword, deleteUserByAdmin, restoreAccount, getUsers}