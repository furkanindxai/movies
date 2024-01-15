import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';

const sequelize = new Sequelize(config.development);

export default sequelize;