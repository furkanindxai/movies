import 'dotenv/config'
import brcypt from "bcrypt"

class User {
    #name
    #password
    #rated = []

    constructor(name, password) {
        this.#name = name;
        this.#password = password;

    }
}