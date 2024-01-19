import "dotenv/config";

import jwt from "jsonwebtoken";

import {User} from "../models/index.js";
import givenStringContainsAnyArrayString from "../helpers/givenStringContainsAnyArrayString.js";

const openRoutes = [`/api/${process.env.API_VERSION}/movies`]

//function checks validity of a JWT token.
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const method = req.method;
  const url = req.originalUrl;
  if (!token) {
    if (method === 'GET' && givenStringContainsAnyArrayString(openRoutes, url)) {
      req.roles = 'user'
      next()
    }
    else return res.sendStatus(401);
  } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
        if (err) {
          console.log(err)
          return res.sendStatus(401);
        } else {
          
          const userFromDb = await User.findOne({ where: { id: user.id } });
          if (!userFromDb) return res.sendStatus(401)
          req.email = user.email;
          req.roles = user.roles;
          req.id = user.id;
          next();
        }
      });
    }
  
}

export default authenticateToken;