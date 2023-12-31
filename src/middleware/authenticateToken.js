import "dotenv/config";

import jwt from "jsonwebtoken";

import User from "../model/user.js";

//function checks validity of a JWT token.
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(401);
        } else {
          const userFromDb = User.getUser(user.id)
          if (userFromDb.deleted) return res.sendStatus(401)
          req.email = user.email;
          req.roles = user.roles;
          req.id = user.id;
          next();
        }
      });
    }
  
}

export default authenticateToken;