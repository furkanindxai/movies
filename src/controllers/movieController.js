import Movie from "../model/movie.js";
import User from "../model/user.js";

const getMovie = (req, res, next) => {
   try { 
        let {title} = req.params;
        title = title.replace("_", " ");
        const movie = Movie.getMovie(title);
        res.status(200).json({title: movie})
    }
    catch (e) {
        console.log(e)
        res.sendStatus(400)
    }
}

const getMovies = (req, res, next) => {
    try {
        const {genre} = req.params;
        if (genre) res.send({movies: Movie.getMovies(genre.toLowerCase())})
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
        res.sendStatus(400)

    }
}

const getRating = (req, res, next) => {
   try { 
        const {title} = req.params;
        res.status(200).json({rating: Movie.getRating(title)})
    }
    catch (e) {
        console.log(e)
        res.sendStatus(400)

    }
}

const searchMovie = (req, res, next) => {
    try {
        const {title} = req.params;
        const movies = Movie.getMovies();
        const matches = movies.filter(movie=>movie.title.toLowerCase().includes(title.toLowerCase()))
        res.status(200).json({movies: matches})
    }
    catch (e) {
        console.log(e)
    }
}

const rateMovie = (req, res, next) => {
    try {
        const {title, rating} = req.body;
        const email = req.email.email;
       
        if (rating < 1 || rating > 5) throw new Error("Rating has to be between 1 & 5!")
       
        const movie = Movie.getMovie(title);
        if (!movie) throw("Movie not in database!")
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
        res.sendStatus(400)

    }
}

export default {getMovie, getMovies, rateMovie, addMovie, getRating, searchMovie}