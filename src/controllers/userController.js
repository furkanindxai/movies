import bcrypt from "bcrypt"
import validator from "validator"

import {Movie, User, Rating} from "../models/index.js"
import hashPassword from "../helpers/hashPassword.js"

//controller function for soft deleting a user
const deleteUser = async (req, res, next) => {
    try {
        let {id} = req;
        id = Number(id)
        if (req.roles.includes("admin")) return res.status(403).json({message: "Cant delete as you are the admin. Contact the dev!"})
        const user = await User.findOne({ where: { id } });
        if (!user) return res.status(404).json({message: "User not found!"})
        await User.destroy({
            where: {
              id
            }
          });
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}
//controller function that allows user account deletion by admin
const deleteUserByAdmin = async (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id);
        const isAdmin = req.roles.includes("admin")
        if (!isAdmin) {
            return res.status(403).json({message: "Require admin level privileges to delete!"})
        }
        else {
            if (id === req.id) {
                return res.status(403).json({message: "Cant delete as you are the admin. Contact the dev!"})
            }
            const user = await User.findOne({ where: { id } });
            if (!user) return res.status(404).json({message: "User not found!"})
         
            await User.destroy({
                where: {
                  id
                }
              });
            res.sendStatus(204)

        }
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}
//controller function that retrieves user movies
const getUserMovies = async (req, res, next) => {
    try {
        const id = req.id;
        let {limit, offset, type} = req.query;
        limit = Number(limit)
        offset = Number(offset)
        type = String(type)
        let movies;
        if (type === 'rated') {
            movies = await Rating.findAll({
                where: {
                    userId: id
                },
                attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'movieId'] },
                include: [{
                    model: Movie,
                    attributes: {
                        exclude: ['createdAt', 'deletedAt', 'updatedAt'] 
                    },
        
                }],
                offset: offset ? offset : 0,limit : limit ? limit : 3232424223,     
            });
        }
        else if (type === 'posted') {
            movies = await Movie.findAll({
                where: {
                    poster: id
                    
                },
                offset: offset ? Number(offset) : 0,limit : limit ? Number(limit) : 3232424223
            });

        }
        else {
            throw new Error("Invalid option for type!")
        }
        
        res.status(200).json(movies)
    }
    catch (e) {
        res.status(400).json({message: e.message})
    }
}
//controller function for password updation.
const updatePassword = async (req, res, next) => {
    try {
        const id = req.id;
        const {password, confirmPassword, newPassword} = req.body;
        if (!password || !confirmPassword || !newPassword) throw new Error("All fields are required!")
        else if (newPassword !== confirmPassword) throw new Error("Passwords don't match!");
        else {
            const user = await User.findOne({ where: { id }});
            if (!user) throw new Error("User doesn't exist!");
            else {
                if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect password!")
                else {
                    if (newPassword.lenght < 4) throw new Error("Password length has to be at least 4!")
                    const hashedPw = hashPassword(newPassword)
                    user.password = hashedPw;
                    await user.save()
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
const restoreAccount = async (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        const roles = req.roles;
        if (!roles.includes("admin")) return res.status(403).json({message: "You don't have admin level privileges!"});
        else {
            const user = await User.findOne({ where: { id }, paranoid: false });
            if (user) {
                await user.restore()
                return res.sendStatus(204)
            }
            else {
                throw new Error("User couldnt be found!")
            
            }
        }
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message: e.message})
    }
}

//function for getting users based on query params, only for admin.
const getUsers = async (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) throw new Error("Only admin can see the list of users!")
        let {offset, limit} = req.query
        offset = Number(offset)
        limit = Number(limit)
        let users = await User.findAll({ attributes: { exclude: ['password']}, 
        paranoid:false, limit: limit ? limit : 78787878, offset: offset ? offset : 0,  order: [['id', 'ASC']]})
        if (req.query.deleted && (req.query.deleted !== 'true' && req.query.deleted !== 'false')) 
            return res.status(400).json({message: "Invalid option for delete!"})
        const deleted = (req.query.deleted === "true") ? true : (req.query.deleted === "false") ? false: undefined
        if (deleted) users = users.filter(user=>user.deletedAt)
        else if (deleted === undefined) users = users
        else users = users.filter(user=>!user.deletedAt)

        res.status(200).json(users)
    }
    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}

//function for getting the details of a particular user
const getUser = async (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) return res.sendStatus(403)
        let {id} = req.params;
        id = Number(id)
        const user = await User.findOne({ where: { id }, paranoid: false, attributes: { exclude: ['password'] }});
        if (!user) throw new Error("User not found!")
        res.status(200).json(user)
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message:e.message})
    }
}

//function for updating user email
const updateUser = async (req, res, next) => {
    try {
        const id = req.id;
        let {email} = req.body;
        if (!email) throw new Error("Require one field!")
        email = email.trim().toLowerCase()
        if (!validator.isEmail(email)) throw new Error("Invalid email!")
        const exists = await User.findOne({ where: { email }});
        if (exists) throw new Error("Account with the given email already exists!")
        const user = await User.findOne({ where: { id }});
        user.email = email;
        await user.save()
        res.status(204).json({message:"User updated!"})

    }

    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}



export default {deleteUser, getUserMovies, updatePassword, deleteUserByAdmin, restoreAccount, getUsers, getUser, updateUser}