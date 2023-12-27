import * as fs from 'fs';

import User from "./user.js"
import arrayHasSameElements from '../helpers/arrayHasSameElements.js';
import validDelete from '../helpers/validDelete.js';

class Movie {
    #title
    #genres
    #poster
    #ratings = []
    #show = true
    #id

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

    static getMovie(id) {
        try {
            const movies = Movie.loadMovies(); 
            let movieExists = movies.find((movie) => movie.id === id)
            if (!movieExists) throw new Error("Movie doesn't exist!");
            else return movieExists
        }

        catch (e) {
            console.log(e);
        }
    }

    static getRating(id) {
        const movie = Movie.getMovie(id)
        
        if (!movie) return false
        const sum = movie.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0)
        return sum / movie.ratings.length
    }

    static getMovies(genres="all") {
        let movies = Movie.loadMovies()
        if (genres === "all") {
            return movies
        }
        else {
            const filteredMovies = movies.filter(movie=>{
                
                if (arrayHasSameElements(genres, movie.genres)) return movie
            })
            return filteredMovies;
        }

    }

    static deleteMovie(id) {
        try {
            const movie = Movie.getMovie(id);
            movie.show = false;
            const movies = Movie.loadMovies();
            const newMovies = movies.map(loadedMovie=>{
                if (loadedMovie.id === id) return movie
                else return loadedMovie
            })
            Movie.saveMovies(newMovies);
        }
        catch (e) {
            console.log(e)
        }
    }

    static getCount() {
        try {
            const dataBuffer = fs.readFileSync('../data/Info.json');
            const dataJSON = dataBuffer.toString();
            const data = JSON.parse(dataJSON)
            return data.movieCount;
        }
        catch (e) {
            console.log(e)
        }
    }

    static incrementCount() {
        try {
            const dataBuffer = fs.readFileSync('../data/Info.json');
            const dataJSON = dataBuffer.toString();
            const data = JSON.parse(dataJSON)
            data.movieCount++;
            const dataInJSON = JSON.stringify(data)
            fs.writeFileSync('../data/Info.json', dataInJSON);
        }
        catch (e) {
            console.log(e)
        }
    }

    constructor(title, genres, poster) {
        this.#title = title
        this.#genres = genres
        this.#poster = poster


        if (!title || genres.length < 1) throw new Error("Title/Genres cant be empty!")
        
        this.#genres = this.#genres.map(genre=>{
            if (typeof genre !== "string" || genre.includes(',') || genre.includes("&")) throw new Error("Genres can only be strings and cant include ',' and '&'!")
            else return genre.toLowerCase()
        
        })
        
        const movies = Movie.loadMovies();
   
        this.#id = Movie.getCount() + 1;
        Movie.incrementCount();
        const newMovie = {id: this.#id,title: this.#title, genres: this.#genres, ratings: this.#ratings, poster: this.#poster, show: this.#show}
        movies.push(newMovie);
        Movie.saveMovies(movies)
        

    }
}

export default Movie