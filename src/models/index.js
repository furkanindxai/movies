import Movie from "./movie.js";
import User from "./user.js";
import Rating from "./rating.js"


Movie.hasMany(Rating, {
    foreignKey: {name: 'movieId', allowNull: false}
})

Rating.belongsTo(Movie, { foreignKey: 'movieId' })

User.hasMany(Rating, {
    foreignKey: {name: 'userId', allowNull: false}
})

Rating.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Movie, {
    foreignKey: {name: 'poster', allowNull: false}
})

Movie.belongsTo(User, { foreignKey: 'poster' })

export {Movie, User, Rating}