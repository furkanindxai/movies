import * as fs from 'fs';

import arrayHasSameElements from '../helpers/arrayHasSameElements.js';
import validStringArray from "../helpers/validStringArray.js"
class Movie {
    #title
    #genres
    #releaseYear
    #description
    #directors
    #producers
    #ratings = []
    #poster
    #deleted = false
    #id

    //returns all movies in the form of an array of javascript objects
    static loadMovies() {
        try {
            const dataBuffer = fs.readFileSync('../data/Movies.json');
            const dataJSON = dataBuffer.toString();
            return JSON.parse(dataJSON);
        } catch (e) {
            console.log(e)
        }
    }

    //saves all movies in the movies argument, which is an array of javascript objects
    static saveMovies(movies) {
        try {
            const dataJSON = JSON.stringify(movies);
            fs.writeFileSync('../data/Movies.json', dataJSON);
        }
        catch (e) {
            console.log(e)
        }
    }
    //retrieves a movie based on movie id
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
    //retrieves the average rating of a movie based on the movie id
    static getRating(id) {
        const movie = Movie.getMovie(id)
        
        if (!movie) return false
        const sum = movie.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0)
        return sum / movie.ratings.length
    }
    //retrieves the movies of a particular genre, if no genre is provided, it retrieves all movies
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
    //soft deletes a movie based on a movie id
    static deleteMovie(id) {
        try {
            const movie = Movie.getMovie(id);
            movie.deleted = true;
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
    //returns the count of all the movies in the json db, which is also used for generating movie id
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
    //increments the count value
    static #incrementCount() {
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
    //construtor takes the title, genres and poster and writes them to the json db
    constructor(title, genres, releaseYear, description, directors, producers, poster) {
        this.#title = title
        this.#genres = genres
        this.#releaseYear = releaseYear
        this.#description = description
        this.#directors = directors
        this.#producers = producers
        this.#poster = poster

        if (!title || !validStringArray(genres) || !validStringArray(directors) || !validStringArray(producers)) throw new Error("Title/Genres/Directors/Producers/Release Year/Description cant be empty!")
        


        this.#genres = this.#genres.map(genre=>{
            if (genre.includes(',')) throw new Error("Genre cant include ','!")
            else return genre.toLowerCase().trim()
        
        })
        
        if (releaseYear < 1900 || releaseYear > 2030) throw new Error("Invalid year!")
        
        title = title.trim()
        description = description.trim()
        directors = directors.map(director=>director.trim())
        producers = producers.map(producer=>producer.trim())

        const movies = Movie.loadMovies();
   
        this.#id = Movie.getCount() + 1;
        Movie.#incrementCount();
        const newMovie = {id: this.#id,title: this.#title, genres: this.#genres, releaseYear:this.#releaseYear, description: this.#description, directors: this.#directors,producers: this.#producers,ratings: this.#ratings, poster: this.#poster, deleted: this.#deleted}
        movies.push(newMovie);
        Movie.saveMovies(movies)
        

    }
}

export default Movie