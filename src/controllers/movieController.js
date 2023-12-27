import validDelete from "../helpers/validDelete.js";
import Movie from "../model/movie.js";
import User from "../model/user.js";

const getMovie = (req, res, next) => {
   try { 
        let {id} = req.params;
        const movie = Movie.getMovie(Number(id));
        if (!movie || !movie.show) throw new Error("Movie not in database!")
        delete movie.show
        res.status(200).json(movie)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}

const getMovies = (req, res, next) => {
    try {

        let {genres, title} = req.query;
        let movies = [];
        
        if (genres || title) {
            if (genres) {
                genres = genres.split(",")
                genres = genres.map(genre=>{
                    return genre.toLowerCase().replaceAll("_", " ")
                })
                movies = Movie.getMovies(genres)
                
            }
            if (genres && title) {
                title = title.replaceAll("_", " ");
                movies = movies.filter(movie=>movie.title.toLowerCase().includes(title.toLowerCase()))
            }
            else if (title) {
                movies = Movie.getMovies();
                movies = movies.filter(movie=>movie.title.toLowerCase().includes(title.toLowerCase()))

            }
            movies = movies.filter(movie=>movie.show)
            movies = movies.map(movie=>{
                delete movie.show
                return movie
            })
            res.status(200).json({movies})
        }
        else {
            movies = Movie.getMovies()
            movies = movies.filter(movie=>movie.show)
            movies = movies.map(movie=>{
                delete movie.show
                return movie
            })
            res.status(200).json({movies})
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e.message)

    }
}

const addMovie = (req, res, next) => {
   try {
        const id = req.id; 
        const {title, genres} = req.body;
        if (!title) throw new Error("Title is required!")
        if (!Array.isArray(genres)) throw new Error("Genres array is required and cant be empty!")
        const movie =  new Movie(String(title.trim()), genres, id);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}

const getRating = (req, res, next) => {
   try { 
        let {id} = req.params;
        id = Number(id)
        const movie = Movie.getMovie(id)
        if (!movie.show) throw new Error("Movie not found!")
        const rating = Movie.getRating(id)
        if (!rating) throw new Error("Movie doesn't exist in the database or hasnt been rated yet!")
        else res.status(200).json({rating})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}

const rateMovie = (req, res, next) => {
    try {
        let {id} = req.params
        id = Number(id)
        let {rating} = req.body;
        if (!rating) throw new Error("Title and rating are required!")
        const userId = req.id;
        if (typeof rating !== "number") throw new Error("Rating has to be a number!");
        if (rating < 1 || rating > 5) throw new Error("Rating has to be between 1 & 5!")
        const movie = Movie.getMovie(Number(id));
        if (!movie || !movie.show) throw new Error("Movie not in database!")
        const user = User.getUser(userId);
        if (!user.rated.includes(id)) {
            user.rated.push(id)
        }
        let indOfRating = -1;
        
        movie.ratings.map((rating,i) => {
            if (rating.id === userId) indOfRating = i;
        })
       
        if (indOfRating === -1) movie.ratings.push({id: userId, rating, show: true})
        else movie.ratings[indOfRating] = {id: userId, show: true}
        
        const movies = Movie.loadMovies();
        const newMovies = movies.map(movieFromArray=>{
            if (movieFromArray.id === id) return movie
            return movieFromArray
        })
        Movie.saveMovies(newMovies)
       
        const users = User.loadUsers()
        const newUsers = users.map(userFromArray=> {
            if (userFromArray.id === userId) return user
            return userFromArray
        })
       
        User.saveUsers(newUsers)


        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}



const deleteMovie = (req, res, next) => {
    try {
        const userId = req.id
        const roles = req.roles
        let {id} = req.params;
        id = Number(id)
        const movie = Movie.getMovie(id);
        if (!movie || !movie.show) throw new Error("Movie not in database!")
        if (!validDelete(userId, movie.poster, roles)) return res.sendStatus(403)
        Movie.deleteMovie(id)
        res.sendStatus(204)
        
    }

    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})
    }
}

const showMovie =  (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        if (!req.roles.includes("admin")) throw new Error("Only the admin can unhide movies!");
        const movie = Movie.getMovie(id);
        movie.show = true;
        let movies = Movie.getMovies();
        movies = movies.map(movieFromArray=>{
            if (movieFromArray.id === id) return movie
            else return movieFromArray
        })
        Movie.saveMovies(movies)
        res.sendStatus(204)
    }

    catch (e) {
        console.log(e)
        res.status(403).json({message: e.message})
    }
}


export default {getMovie, getMovies, rateMovie, addMovie, getRating, deleteMovie, showMovie}