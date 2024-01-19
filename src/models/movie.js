import { DataTypes, Model } from 'sequelize';

import sequelize from '../db/index.js';

class Movie extends Model {
   
}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    poster: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    ,
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genres: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    directors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    producers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false
    },
    averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0

    },
    imageThumbnail: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.TEXT
    }

},{ sequelize,  modelName: 'Movie', paranoid: true });


export default Movie;