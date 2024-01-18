import { DataTypes, Model } from 'sequelize';

import sequelize from '../db/index.js';

class Rating extends Model {
   
}

Rating.init({

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },


    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    
    }


}, { sequelize,  modelName: 'Rating', });


export default Rating;