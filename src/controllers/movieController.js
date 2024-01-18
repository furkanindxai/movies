import { Op } from 'sequelize';

import validDelete from "../helpers/validDelete.js";
import {Movie} from "../models/index.js";
import sequelize from "../db/index.js";
import validStringArray from "../helpers/validStringArray.js";
import {Rating} from "../models/index.js";
//retrieves a movie based on id only if the movie's delete value is false
const getMovie = async (req, res, next) => {
   try { 
        let {id} = req.params;
        id = Number(id)
        const movie = await Movie.findOne({ where: { id }, paranoid: false, attributes: { exclude: [req.roles.includes('admin') ? '' : 'deletedAt'] } });

        if (!movie) throw new Error("Movie not in db!")
        if (req.roles.includes("admin")) {
            return res.status(200).json(movie)
        }
        if (movie.deletedAt) throw new Error("Movie not in database!")

        res.status(200).json(movie)
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message: e.message})
    }
}
//retrives movies based on query params(title, genres, offset and limit), if no query params are provided retrieves all movies
const getMovies = async (req, res, next) => {
    try {

        let {genres, keyword, offset, limit, deleted, sortBy, order} = req.query;
        if (deleted && !req.roles.includes("admin")) return res.sendStatus(403)

        let movies = [];
        
        if (genres && keyword) {
            genres = genres.split(",")
            genres = genres.map(genre=>{
                return genre.toLowerCase().replaceAll("_", " ").trim()
            })
            keyword = keyword.replaceAll("_", " ");
               
            movies = await Movie.findAll({
                where: {
                    genres: { [Op.contains]: sequelize.cast(genres, 'VARCHAR(255)[]')},
                    [Op.or]: [ sequelize.literal(`CAST ("directors" AS TEXT) ILIKE '%${keyword}%'`),
                            sequelize.literal(`CAST ("producers" AS TEXT) ILIKE '%${keyword}%'`),
                            sequelize.literal(`title ILIKE '%${keyword}%'`)
                        
                    ],
                    
                },
                offset: offset ? Number(offset) : 0,limit : limit ? Number(limit) : 3232424223,
                order: [sortBy?sortBy: 'title', order?order: 'ASC'],
                paranoid: false ,
                attributes: { exclude: [req.roles.includes('admin') ? '' : 'deletedAt'] }  
            });
            }
        else if (genres) {
            genres = genres.split(",")
            genres = genres.map(genre=>{
                return genre.toLowerCase().replaceAll("_", " ").trim()
            })
            movies = await Movie.findAll({
                where: {
                    genres: { [Op.contains]: sequelize.cast(genres, 'VARCHAR(255)[]')},

                },
                offset: offset ? Number(offset) : 0,limit : limit ? Number(limit) : 3232424223,
                order: [[sortBy?sortBy: 'title', order?order: 'ASC']],
                paranoid: false,
                attributes: { exclude: [req.roles.includes('admin') ? '' : 'deletedAt'] }  


                });            
        }   
        else if (keyword) {
            keyword = keyword.replaceAll("_", " ");
            movies = await Movie.findAll({
                where: {
                    [Op.or]: [ sequelize.literal(`CAST ("directors" AS TEXT) ILIKE '%${keyword}%'`),
                            sequelize.literal(`CAST ("producers" AS TEXT) ILIKE '%${keyword}%'`),
                            sequelize.literal(`title ILIKE '%${keyword}%'`)
                        
                        ]
                    
                },
                offset: offset ? Number(offset) : 0,limit : limit ? Number(limit) : 3232424223,
                order: [[sortBy?sortBy: 'title', order?order: 'ASC']],
                paranoid: false,
                attributes: { exclude: [req.roles.includes('admin') ? '' : 'deletedAt'] }  

        });
        
        }
        else {
            movies = await Movie.findAll({
                offset: offset ? Number(offset) : 0,limit : limit ? Number(limit) : 3232424223,  
                order: [[sortBy?sortBy: 'title', order?order: 'ASC']], paranoid: false,
                attributes: { exclude: [req.roles.includes('admin') ? '' : 'deletedAt'] }  
            })
            
        }
        if (!req.roles.includes('admin')){ 
            movies = movies.filter(movie=>movie.deletedAt === null)
        }

        else {
            if (deleted === 'true') movies = movies.filter(movie=>movie.deletedAt !== null)
            else if (deleted === 'false') movies.filter(movie=>movie.deletedAt === null)
        }
        
        res.status(200).json({movies})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}
//controller function for adding a movie to db
const addMovie = async (req, res, next) => {
   try {
        const id = req.id; 
        let {title, genres, releaseYear, description, directors, producers} = req.body;
        
        if (!title || !releaseYear || !description || !validStringArray(genres) || !validStringArray(directors) || !validStringArray(producers)) throw new Error("Invalid data format!")
        
        genres = genres.map(genre=>genre.trim().toLowerCase())

        const movie =  await Movie.create({title: String(title.trim()), genres, releaseYear: Number(releaseYear), description: String(description),
         directors, producers, poster: id});
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})

    }
}
//controller function for retrieving the average rating of a movie
const getRating = async (req, res, next) => {
   try { 
        let {id} = req.params;
        id = Number(id)
        const movie = await Movie.findOne({ where: { id } });
        if (!movie) throw new Error("Movie not found!")

        const rating = await Rating.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'] 
              ],
            where: {
              movieId: id
            }
          });

        if (!rating) throw new Error("Movie hasnt been rated yet!")
        else res.status(200).json({rating: rating[0].dataValues.avg_rating})
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message:e.message})

    }
}
//controller function for rating a movie 
const rateMovie = async (req, res, next) => {
    try {
        let {id} = req.params
        id = Number(id)
        let {rating} = req.body;
        if (!rating) throw new Error("Title and rating are required!")
        const userId = req.id;
        if (typeof rating !== "number") throw new Error("Rating has to be a number!");
        if (rating < 1 || rating > 5) throw new Error("Rating has to be between 1 & 5!")
        const movie = await Movie.findOne({ where: { id } });
        if (!movie) throw new Error("Movie not in database!")
        const [oldRating, created] = await Rating.findOrCreate({
            where: { userId, movieId:id },
            defaults: {
              movieId: id,
              userId,
              rating
            }
          });
          oldRating.rating = rating
          oldRating.save()


        res.sendStatus(201);
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})

    }
}


//controller function for soft deleting a movie
const deleteMovie = async (req, res, next) => {
    try {
        const userId = req.id
        const roles = req.roles
        let {id} = req.params;
        id = Number(id)
        const movie = await Movie.findOne({ where: { id }});
        if (!movie) throw new Error("Movie not in database!")
        if (!validDelete(userId, movie.poster, roles)) return res.sendStatus(403)
        await Movie.destroy({
            where: {
              id
            }
          });
        res.sendStatus(204)
        
    }

    catch (e) {
        console.log(e)
        res.status(404).json({message:e.message})
    }
}
//controller function for restoring a movie
const restoreMovie =  async (req, res, next) => {
    try {
        let {id} = req.params;
        if (!req.roles.includes("admin")) return res.status(403).json({message: "Only admin can restore movies!"})
        id = Number(id)
        
        const movie = await Movie.findOne({ where: { id }, paranoid: false });
        if (movie) {
            await movie.restore()
            return res.sendStatus(204)
        }
        else {
            throw new Error("Movie couldnt be found!")
        
        }
    }
    catch (e) {
        console.log(e)
        res.status(404).json({messge: e.message})
    }
}

//controller function for updating movie description
const updateDescription = async (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        let {description} = req.body;
        if (!description) throw new Error("At least one field is required!")
        description = String(description)
        description = description.trim()
        const movie = await Movie.findOne({ where: { id } });
        if (!movie) throw new Error("Movie not in db!")
        if (!(movie.poster === req.id)) return res.sendStatus(403)
        movie.description = description
        movie.save()
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message: e.message})
    }
}


export default {getMovie, getMovies, rateMovie, addMovie, getRating, deleteMovie, restoreMovie, updateDescription}