import "dotenv/config";

import jwt from "jsonwebtoken";

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        if (err) {
          return res.sendStatus(401);
        } else {
          req.email = email;
          next();
        }
      });
    }
  
}

export default authenticateToken;