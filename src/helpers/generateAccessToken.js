import "dotenv/config";

import jwt from "jsonwebtoken";

//function generates an access JWT token based on email, roles and id which expires in 7 days.
function generateAccessToken(email, roles, id) {
  return jwt.sign({ email, roles, id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

export default generateAccessToken;