import User from "../model/user.js"

const deleteUser = (req, res, next) => {
    try {
        User.deleteUser(req.email.email)
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