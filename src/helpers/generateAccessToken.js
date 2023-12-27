import "dotenv/config";

import jwt from "jsonwebtoken";

function generateAccessToken(email, roles, id) {
  return jwt.sign({ email, roles, id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

export default generateAccessToken;