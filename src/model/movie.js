import * as fs from 'fs';

import User from "./user.js"

class Movie {
    #title
    #genres
    #ratings = []

    static loadMovies() {
        try {
            const dataBuffer = fs.readFileSync('../data/Movies.json');
            const dataJSON = dataBuffer.toString();
            return JSON.parse(dataJSON);
        } catch (e) {
            console.log(e)
        }
    }

    static saveMovies(movies) {
        try {
            const dataJSON = JSON.stringify(movies);
            fs.writeFileSync('../data/Movies.json', dataJSON);
        }
        catch (e) {
            console.log(e)
        }
    }

    static getMovie(title) {
        try {
            const movies = Movie.loadMovies(); 
            let movieExists = movies.find((movie) => movie.title === title)
            if (!movieExists) throw new Error("Movie doesn't exist!");
            return movieExists
        }

        catch (e) {
            console.log(e);
        }
    }

    static rateMovie(title, rating ,email ) {
        try {
            if (rating < 1 || rating > 5) throw new Error("Rating has to be between 1 & 5!")
            const movie = Movie.getMovie(title);
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
        }
        
        catch (e) {
            console.log(e)
        }

    }

    static getRating(title) {
        const movie = Movie.getMovie(title)
        const sum = movie.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0)
        return sum / movie.ratings.length
    }

    static getMovies(genre="all") {
        const movies = Movie.loadMovies()
        
        if (genre === "all") {
            return movies
        }
        else {
            const filteredMovies = movies.filter(movie=>movie.genres.includes(genre))
            return filteredMovies;
        }

    }

    constructor(title, genres) {
        this.#title = title
        this.#genres = genres
        if (!title || genres.length < 1) throw new Error("Title/Genres cant be empty!")
        
        genres = genres.map(genre=>{
            if (typeof genre !== "string") throw new Error("Genres can only be strings!")
            else return genre.toLowerCase()
        
        })
        
        const movies = Movie.loadMovies();
        const movieAlreadyExists = movies.find(movie=>movie.title === title)
        
        if (movieAlreadyExists) throw new Error("Movie already exists in the database!");
        else {
            const newMovie = {title, genres, ratings: this.#ratings}
            movies.push(newMovie);
            Movie.saveMovies(movies)
        }

    }
}

export default Movie