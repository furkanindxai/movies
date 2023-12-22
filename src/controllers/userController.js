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

export default {deleteUser, getUserMovies}