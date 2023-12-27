class Token {
    #id
    #tokens = []

    static deleteToken(id, token) {

    }

    static deleteAllUserTokens(id) {

    }

    static checkTokenValidity(id, token) {

    }

    constructor(id, token) {
        this.#id = id
        if (this.#tokens.includes(token)) throw new Error("Token already in db!")
        this.#tokens.push(token)
    }



}

export default Token