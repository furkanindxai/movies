import Movie from "../model/movie.js";
import User from "../model/user.js";

const getMovie = (req, res, next) => {
   try { 
        let {title} = req.params;
        title = title.replaceAll("_", " ");
        const movie = Movie.getMovie(title);
        if (!movie) throw new Error("Movie not in database!")
        res.status(200).json(movie)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
}

const getMovies = (req, res, next) => {
    try {
        let {genres} = req.params;
        if (genres) {
            genres = genres.replaceAll("_", " ");
            genres = genres.split("&");
            genres = genres.map(genre=>{
                if (genre.includes(',')) throw new Error("Genre cant include ','!");
                return genre.toLowerCase()
            })
            const movies = Movie.getMovies(genres)
            res.send({movies})
        }
        else res.status(200).json({movies: Movie.getMovies()})
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e.message)

    }
}

const addMovie = (req, res, next) => {
   try { 
        const {title, genres} = req.body;
        if (!title) throw new Error("Title is required!")
        if (!Array.isArray(genres)) throw new Error("Genres array is required and cant be empty!")
        const movie =  new Movie(String(title.trim()), genres);
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}

const getRating = (req, res, next) => {
   try { 
        let {title} = req.params;
        title = title.replaceAll("_", " ");
        const rating = Movie.getRating(title)
        if (!rating) throw new Error("Movie doesn't exist in the database or hasnt been rated yet!")
        else res.status(200).json({rating})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}

const searchMovie = (req, res, next) => {
    try {
        let {title} = req.query;
        if (!title) throw new Error("Title cant be empty!")
        title = title.replaceAll("_", " ");
        const movies = Movie.getMovies();
        const matches = movies.filter(movie=>movie.title.toLowerCase().includes(title.toLowerCase()))
        res.status(200).json({movies: matches})
    }
    catch (e) {
        res.status(400).send({message:e.message})
        console.log(e)
    }
}

const rateMovie = (req, res, next) => {
    try {
        let {title, rating} = req.body;
        if (!title || !rating) throw new Error("Title and rating are required!")
        title = String(title).trim()
        const email = req.email.email;
        if (typeof rating !== "number") throw new Error("Rating has to be a number!");
        if (rating < 1 || rating > 5) throw new Error("Rating has to be between 1 & 5!")
       
        const movie = Movie.getMovie(title);
        if (!movie) throw new Error("Movie not in database!")
        const user = User.getUser(email);
        if (user.rated.includes(title)) {
            user.rated = user.rated.filter(rated=>rated!=title)
        }
       
        user.rated.push(title)
        let indOfRating = -1;
        
        movie.ratings.map((rating,i) => {
            if (rating.email === email) indOfRating = i;
        })
       
        if (indOfRating === -1) movie.ratings.push({email, rating})
        else movie.ratings[indOfRating] = {email, rating}
        
        const movies = Movie.loadMovies();
        const newMovies = movies.map(movieFromArray=>{
            if (movieFromArray.title === title) return movie
            return movieFromArray
        })
        Movie.saveMovies(newMovies)
       
        const users = User.loadUsers()
        const newUsers = users.map(userFromArray=> {
            if (userFromArray.email === email) return user
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

export default {getMovie, getMovies, rateMovie, addMovie, getRating, searchMovie}