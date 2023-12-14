import * as fs from 'fs';
import validator from 'validator';

import hashPassword from '../helpers/hashPassword.js';


class User {
    #email;
    #password;
    #rated = [];

    static loadUsers() {
        try {
            const dataBuffer = fs.readFileSync('../data/Users.json');
            const dataJSON = dataBuffer.toString();
            return JSON.parse(dataJSON);
        } catch (e) {
            console.log(e)
        }
    }

    static #saveUsers(users) {
        try {
            const dataJSON = JSON.stringify(users);
            fs.writeFileSync('../data/Users.json', dataJSON);
        }
        catch (e) {
            console.log(e)
        }
    }

    static deleteUser(email) {
        try {
            const users = User.loadUsers();

            let userExists = users.find((user) => user.email === email)
            if (!userExists) throw new Error("User doesn't exist!");

            const newUsers = users.filter(user=> email !== user.email);
            User.#saveUsers(newUsers);
        }
        catch (e) {
            console.log(e)
        }
        
    }

    static getUser(email) {
        try {
            const users = User.loadUsers(); 
            let userExists = users.find((user) => user.email === email)
            if (!userExists) throw new Error("User doesn't exist!");
            return userAlreadyExists
        }

        catch (e) {
            console.log(e);
        }
    }
    // static addRating(email, movieTitle, rating) {

    // }

    

    constructor(email, password) {
        if (!validator.isEmail(email)) throw Error("Invalid email!");
        

        const users = User.loadUsers(); 
        let userAlreadyExists = users.find((user) => user.email === email)


        if (userAlreadyExists) throw Error("User is already registered!")


        // if (!name) { //user is trying to login
        //     const invalidCreds = !userAlreadyExists || !bcrypt.compareSync(password, userAlreadyExists.password)
            
        //     if (invalidCreds) throw Error("Invalid credentials!")
        //     else {
        //         this.#email = email;
        //         this.#password = password;
        //         this.#rated = userAlreadyExists.rated;
        //         console.log(this.#email)
        //     }
        // }
        
        else {
            if (!password) throw new Error("Password field can't be blank!");
            this.#email = email;
            this.#password = hashPassword(password);
            this.#rated = [];
            const newUser = { email: this.#email, password: this.#password, rated:this.#rated};
        
    
            users.push(newUser)
            User.#saveUsers(users)
        }
       
    }


  
}

export default User