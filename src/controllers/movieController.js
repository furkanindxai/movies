import validDelete from "../helpers/validDelete.js";
import paginate from "../helpers/paginate.js";
import sortObjectArray from "../helpers/sortObjectArray.js"
import inAnyStringOfArr from "../helpers/inAnyStringOfArr.js";
import Movie from "../model/movie.js";
import User from "../model/user.js";
//retrieves a movie based on id only if the movie's delete value is false
const getMovie = (req, res, next) => {
   try { 
        let {id} = req.params;
        const movie = Movie.getMovie(Number(id));
        if (!movie) throw new Error("Movie not in db!")
        if (req.roles.includes("admin")) {
            return res.status(200).json(movie)
        }
        if (movie.deleted) throw new Error("Movie not in database!")
        delete movie.deleted
        res.status(200).json(movie)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}
//retrives movies based on query params(title, genres, offset and limit), if no query params are provided retrieves all movies
const getMovies = (req, res, next) => {
    try {

        let {genres, keyword, offset, limit, deleted, sortBy, order} = req.query;
        if (deleted && !req.roles.includes("admin")) return res.sendStatus(403)
        if (offset && !limit || limit && !offset) throw new Error("Limit and offset are both required!")
        if (sortBy && !order || order && !sortBy) throw new Error("sortBy and order are both required!")

        let movies = [];

        if (genres || keyword) {
            if (genres) {
                genres = genres.split(",")
                genres = genres.map(genre=>{
                    return genre.toLowerCase().replaceAll("_", " ")
                })
                movies = Movie.getMovies(genres)
                
            }
            if (genres && keyword) {
                title = title.replaceAll("_", " ");
                movies = movies.filter(movie=>movie.title.toLowerCase().includes(keyword.toLowerCase()) || inAnyStringOfArr(movie.directors, keyword) || inAnyStringOfArr(movie.producers, keyword))
            }
            else if (keyword) {
                movies = Movie.getMovies();
                movies = movies.filter(movie=>movie.title.toLowerCase().includes(keyword.toLowerCase()) || inAnyStringOfArr(movie.directors, keyword) || inAnyStringOfArr(movie.producers, keyword))

            }
        }
        else {
            movies = Movie.getMovies()

        }
        if (offset && limit) {
            offset = Number(offset)
            limit = Number(limit)
            if (!deleted) movies = paginate(movies,"deleted", false,offset, limit)
            else {
                if (deleted === "both") movies = paginate(movies,"none", 0, offset, limit)
                else if (deleted === "true") movies = paginate(movies,"deleted", true, offset, limit)
                else if (deleted === "false") movies = paginate(movies,"deleted", false, offset, limit)
            }
        }
        else {

            if (!deleted) movies = movies.filter(movie=>!movie.deleted)
            else {
                if (deleted === "both") movies = movies
                else if (deleted === "true")  movies = movies.filter(movie=>movie.deleted)
                else if (deleted === "false") movies = movies.filter(movie=>!movie.deleted)
            }
        } 
        movies = movies.map(movie=>{
            delete movie.deleted
            return movie
        })
        if ((sortBy === "releaseYear" || sortBy === "title") && (order === "asc" || order === "dsc")) movies = sortObjectArray(movies, sortBy, order)
        res.status(200).json({movies})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}
//controller function for adding a movie to db
const addMovie = (req, res, next) => {
   try {
        const id = req.id; 
        let {title, genres, releaseYear, description, directors, producers} = req.body;

        if (!title) throw new Error("Title is required!")
        if (!Array.isArray(genres)) throw new Error("Genres array is required and cant be empty!")
        const movie =  new Movie(String(title.trim()), genres, Number(releaseYear), String(description), directors, producers,id);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}
//controller function for retrieving the average rating of a movie
const getRating = (req, res, next) => {
   try { 
        let {id} = req.params;
        id = Number(id)
        const movie = Movie.getMovie(id)
        if (movie.deleted) throw new Error("Movie not found!")
        const rating = Movie.getRating(id)
        if (!rating) throw new Error("Movie doesn't exist in the database or hasnt been rated yet!")
        else res.status(200).json({rating})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}
//controller function for rating a movie 
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
        if (!movie || movie.deleted) throw new Error("Movie not in database!")
        const user = User.getUser(userId);
        if (!user.rated.includes(id)) {
            user.rated.push(id)
        }
        let indOfRating = -1;
        
        movie.ratings.map((rating,i) => {
            if (rating.id === userId) indOfRating = i;
        })
       
        if (indOfRating === -1) movie.ratings.push({id: userId, rating})
        else movie.ratings[indOfRating] = {id: userId, rating}
        
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


//controller function for soft deleting a movie
const deleteMovie = (req, res, next) => {
    try {
        const userId = req.id
        const roles = req.roles
        let {id} = req.params;
        id = Number(id)
        const movie = Movie.getMovie(id);
        if (!movie || movie.deleted) throw new Error("Movie not in database!")
        if (!validDelete(userId, movie.poster, roles)) return res.sendStatus(403)
        Movie.deleteMovie(id)
        res.sendStatus(204)
        
    }

    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})
    }
}
//controller function for restoring a movie
const restoreMovie =  (req, res, next) => {
    try {
        let {id} = req.params;
        if (!req.roles.includes("admin")) return res.status(403).json({message: "Only admin can restore movies!"})
        id = Number(id)
        const movie = Movie.getMovie(id);
        if (!movie) throw new Error("Movie not in db!")
        if (!movie.deleted) return res.sendStatus(204)
        movie.deleted = false;
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
        res.status(400).json({messge: e.message})
    }
}

//controller function for updating movie description
const updateDescription = (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        let {description} = req.body;
        if (!description) throw new Error("Description is required!")
        description = String(description)
        description = description.trim()
        const movie = Movie.getMovie(id)
        if (!movie) throw new Error("Movie not in db!")
        if (!(movie.poster === req.id)) return res.sendStatus(403)
        if (movie.deleted) throw new Error("Movie not in db!")
        movie.description = description
        let movies = Movie.getMovies()
        movies = movies.map(movieFromArray=>{
            if (movieFromArray.id === id) return movie
            return movieFromArray
        })
        Movie.saveMovies(movies)
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}


export default {getMovie, getMovies, rateMovie, addMovie, getRating, deleteMovie, restoreMovie, updateDescription}