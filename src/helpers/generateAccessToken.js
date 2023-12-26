import "dotenv/config";

import jwt from "jsonwebtoken";

function generateAccessToken(email) {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
}

export default generateAccessToken;