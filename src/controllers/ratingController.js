import sequelize from "../db/index.js";
import { Op } from 'sequelize';

import {Movie, Rating} from "../models/index.js";
import validDelete from "../helpers/validDelete.js";


//deletes a rating
const deleteRating = async (req, res, next) => {
    try {
        let {id} = req.params;
        id = Number(id)
        const rating = await Rating.findOne({where: {id}})
        if (!rating) return res.sendStatus(404)
        const movie = await Movie.findOne({ where: { id: rating.movieId } });
        if (!movie) return res.sendStatus(404)
        const requester = req.id
        const roles = req.roles
        if (!validDelete(requester, rating.userId, roles)) return res.sendStatus(403)
        await Rating.destroy({
            where: {
              id
            }
          });
        const averageRating = await Rating.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'] 
                ],
            where: {
                movieId: rating.movieId
            }
        });
        movie.averageRating = averageRating[0].dataValues.avg_rating
        await movie.save()
        res.status(204).json({message:"Rating deleted!"})
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})
    }
}

//restores a rating
const restoreRating = async (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) return res.sendStatus(403)
        
        let {id} = req.params;
        id = Number(id)

        const rating = await Rating.findOne({where: {id}, paranoid: false})
        if (!rating) return res.sendStatus(404)

        const movie = await Movie.findOne({ where: { id: rating.movieId } });
        if (!movie) return res.status(404).json({message: 'Not found!'})


        await rating.restore()
        const averageRating = await Rating.findAll({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'] 
                ],
            where: {
                movieId: rating.movieId
            }
        });
        movie.averageRating = averageRating[0].dataValues.avg_rating
        await movie.save()
        res.sendStatus(204)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})
    }
}

//retreives all ratings
const getRatings = async (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) return res.sendStatus(403)
        if (req.query.deleted && (req.query.deleted !== 'true' && req.query.deleted !== 'false')) 
            return res.status(400).json({message: "Invalid option for delete!"})
        let {limit, offset, deleted} = req.query
        offset = Number(offset)
        limit = Number(limit)
        const ratings = await Rating.findAll({
            where: {
                deletedAt: deleted ? (deleted === 'true' ? sequelize.literal(`"deletedAt" IS NOT NULL`) 
                : sequelize.literal(`"deletedAt" IS NULL`)) : 
                {[Op.or]: [sequelize.literal(`"deletedAt" IS NOT NULL`), sequelize.literal(`"deletedAt" IS NULL`)]}
             },
             attributes: { exclude: ['password']}, 
             paranoid:false, limit: limit ? limit : 78787878,
             offset: offset ? offset : 0,  order: [['id', 'ASC']]
        })
        res.status(200).json(ratings)
    }
    catch (e) {
        console.log(e)
        res.status(400).json({message:e.message})
    }
}

//get rating by id
const getRatingById = async (req, res, next) => {
    try {
        if (!req.roles.includes("admin")) return res.sendStatus(403)
        let {id} = req.params;
        id = Number(id)
        const rating = await Rating.findOne({ where: { id }, paranoid: false});
        if (!rating) throw new Error("Rating not found!")
        res.status(200).json(rating)
    }
    catch (e) {
        console.log(e)
        res.status(404).json({message:e.message})
    }
}


export default {deleteRating, restoreRating, getRatings, getRatingById}