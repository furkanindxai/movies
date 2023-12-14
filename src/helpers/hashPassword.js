import 'dotenv/config';

import bcrypt from "bcrypt";

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

export default hashPassword;