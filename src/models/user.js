import { DataTypes, Model } from 'sequelize';

import sequelize from '../db/index.js';

class User extends Model {

   
}

User.init({ 
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roles: {
    type: DataTypes.STRING,
    defaultValue: "user"
  },
}, { sequelize,  modelName: 'User', paranoid: true });


export default User;