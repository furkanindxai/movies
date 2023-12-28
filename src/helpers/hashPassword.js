import 'dotenv/config';

import bcrypt from "bcrypt";

//function generates the hash of a password.
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

export default hashPassword;