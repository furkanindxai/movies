import sequelize from "../db/index.js";


//function checks db connection
async function testDbConnection(req, res, next) {
  try {
    await sequelize.authenticate();
    next()
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return res.status(500).json({message: 'Db connection failed!'})
  }  
}

export default testDbConnection;