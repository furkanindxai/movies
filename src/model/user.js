import * as fs from 'fs';
import validator from 'validator';

import hashPassword from '../helpers/hashPassword.js';

import Movie from "./movie.js"
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

    static saveUsers(users) {
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
            User.saveUsers(newUsers);
            return false
        }
        catch (e) {
            console.log(e)
            return {error: e.message}
        }
        
    }

    static getUser(email) {
        try {
            const users = User.loadUsers(); 
            let userExists = users.find((user) => user.email === email)
            if (!userExists) throw new Error("User doesn't exist!");
            return userExists
        }

        catch (e) {
            console.log(e);
        }
    }

    static getUserMovies(email) {
        try {
            const movies = Movie.getMovies()
            const rated = []
            movies.forEach(movie=>{
                movie.ratings.forEach(rating=>{
                    if (rating.email===email) {
                        rated.push(movie)
                    }
                })
            })
            return rated
        }

        catch(e) {
            console.log(e)
        }
    }

    constructor(email, password) {
        if (!validator.isEmail(email)) throw new Error("Invalid email!");
        

        const users = User.loadUsers(); 
        let userAlreadyExists = users.find((user) => user.email === email.toLowerCase())


        if (userAlreadyExists) throw new Error("User is already registered!")

        else {
            if (!password || password.length < 4) throw new Error("Invalid password!");
            this.#email = email.toLowerCase();
            this.#password = hashPassword(password);
            this.#rated = [];
            const newUser = { email: this.#email, password: this.#password, rated:this.#rated};
        
    
            users.push(newUser)
            User.saveUsers(users)
        }
       
    }


  
}


export default User