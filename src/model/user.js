import * as fs from 'fs';
import validator from 'validator';

import hashPassword from '../helpers/hashPassword.js';

import Movie from "./movie.js"
class User {
    #email;
    #password;
    #rated = [];
    #roles = ["user"]
    #active = true;
    #id;
    //retrieves all users in the form of an array of javascript objects
    static loadUsers() {
        try {
            const dataBuffer = fs.readFileSync('../data/Users.json');
            const dataJSON = dataBuffer.toString();
            return JSON.parse(dataJSON);
        } catch (e) {
            console.log(e)
        }
    }
    //saves all users in the users argument, which is an array of javascript objects
    static saveUsers(users) {
        try {
            const dataJSON = JSON.stringify(users);
            fs.writeFileSync('../data/Users.json', dataJSON);
        }
        catch (e) {
            console.log(e)
        }
    }
    //deletes a user based on the id argument.
    static deleteUser(id) {
        try {
            const users = User.loadUsers();

            let userExists = users.find((user) => user.id === id)
            if (!userExists) throw new Error("User doesn't exist!");

            const newUsers = users.map(user=>{
                if (user.id === id) {
                    user.active = false
                    return user
                }
                return user
            })
            User.saveUsers(newUsers);
            return false
        }
        catch (e) {
            console.log(e)
            return {error: e.message}
        }
        
    }
    //retrieves a user based on the id.
    static getUser(id) {
        try {
            const users = User.loadUsers(); 
            let userExists = users.find((user) => user.id === id)
            if (!userExists) throw new Error("User doesn't exist!");
            return userExists
        }

        catch (e) {
            console.log(e);
        }
    }
    //retrieves all the movies that have been rated by the user.
    static getUserMovies(id) {
        try {
            const movies = Movie.getMovies()
            const rated = []
            movies.forEach(movie=>{
                movie.ratings.forEach(rating=>{
                    if (rating.id===id) {
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
    //retrives the total number of movies in the json db.
    static getCount() {
        try {
            const dataBuffer = fs.readFileSync('../data/Info.json');
            const dataJSON = dataBuffer.toString();
            const data = JSON.parse(dataJSON)
            return data.userCount;
        }
        catch (e) {
            console.log(e)
        }
    }
    //increments the count.
    static incrementCount() {
        try {
            const dataBuffer = fs.readFileSync('../data/Info.json');
            const dataJSON = dataBuffer.toString();
            const data = JSON.parse(dataJSON)
            data.userCount++;
            const dataInJSON = JSON.stringify(data)
            fs.writeFileSync('../data/Info.json', dataInJSON);
        }
        catch (e) {
            console.log(e)
        }
    }
    //saves a user based on email and password
    constructor(email, password) {
        if (!validator.isEmail(email)) throw new Error("Invalid email!");
        

        const users = User.loadUsers(); 
        let userAlreadyExists = users.find((user) => user.email === email.toLowerCase())


        if (userAlreadyExists) throw new Error("User is already registered!")

        else {
            
            if (!password || password.length < 4) throw new Error("Invalid password!");
            this.#email = email.toLowerCase();
            this.#password = hashPassword(password);
            this.#id = User.getCount() + 1;
            User.incrementCount()
            const newUser = { id:this.#id ,email: this.#email, password: this.#password, rated:this.#rated, active: this.#active, roles: this.#roles };
            users.push(newUser)
            User.saveUsers(users)

        }
       
    } 
}


export default User