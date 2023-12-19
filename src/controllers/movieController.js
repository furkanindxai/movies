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
        let {genre} = req.params;
        if (genre) {
            genre = genre.replaceAll("_", " ");
            res.send({movies: Movie.getMovies(genre.toLowerCase())})
        }
        else res.status(200).json({movies: Movie.getMovies()})
    }
    catch (e) {
        console.log(e)
        res.sendStatus(400)

    }
}

const addMovie = (req, res, next) => {
   try { 
        const {title, genres} = req.body;
        const movie =  new Movie(title, genres);
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
        let {title} = req.params;
        title = title.replaceAll("_", " ");
        if (!title) throw new Error("Title cant be empty!")
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
        const {title, rating} = req.body;
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