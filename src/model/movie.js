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

    static #saveMovies(movies) {
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
            const movie = Movie.getMovie(title);
            const user = User.getUser(email);
            user.rated.push(title)
            movie.ratings.push({email, rating})
            const movies = Movie.loadMovies();
            const newMovies = movies.map(movieFromArray=>{
                if (movieFromArray.title === title) return movie
                return movieFromArray
            })
            Movie.#saveMovies(newMovies)
          
        }
        
        catch (e) {

        }

    }

    constructor(title, genres) {
        this.#title = title
        this.#genres = genres
        if (!title || genres.length < 1) throw new Error("Title/Genres cant be empty!")
        
        genres.forEach(genre => {
            if (typeof genre !== "string") throw new Error("Genres can only be strings!")
        });
        
        const movies = Movie.loadMovies();
        const movieAlreadyExists = movies.find(movie=>movie.title === title)
        
        if (movieAlreadyExists) throw new Error("Movie already exists in the database!");
        else {
            const newMovie = {title, genres, ratings: this.#ratings}
            movies.push(newMovie);
            Movie.#saveMovies(movies)
        }
    }

}

Movie.rateMovie("Terminator", 5, "furkan@gmail.com")
export default Movie