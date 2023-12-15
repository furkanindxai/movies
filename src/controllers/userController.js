import User from "../model/user.js"

const deleteUser = (req, res, next) => {
    try {
        User.deleteUser(req.params.email)
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(400)

    }
}

const getUserMovies = (req, res, next) => {
    const email = req.email;
    const movies = User.getMovies(email)
    res.status(200).send({movies})
}

export default {deleteUser, getUserMovies}