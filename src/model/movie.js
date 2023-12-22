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
            else return movieExists
        }

        catch (e) {
            console.log(e);
        }
    }

    static getRating(title) {
        const movie = Movie.getMovie(title)
        if (!movie) return false
        const sum = movie.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0)
        return sum / movie.ratings.length
    }

    static getMovies(genres="all") {
        const movies = Movie.loadMovies()
        
        if (genres === "all") {
            return movies
        }
        else {
            const requestedGenres = genres.sort().join(',')
            const filteredMovies = movies.filter(movie=>{
                
                const movieGenres = movie.genres.sort().join(',')
                if (movieGenres === requestedGenres || movieGenres.includes(requestedGenres)) return movie
            })
            return filteredMovies;
        }

    }

    constructor(title, genres) {
        this.#title = title
        this.#genres = genres
        if (!title || genres.length < 1) throw new Error("Title/Genres cant be empty!")
        
        genres = genres.map(genre=>{
            if (typeof genre !== "string" || genre.includes(',') || genre.includes("&")) throw new Error("Genres can only be strings and cant include ',' and '&'!")
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