import { Sequelize } from 'sequelize';
import config from '../config/dbConfig.js';

const sequelize = new Sequelize(config.development);

(async () => await sequelize.sync())();

export default sequelize;