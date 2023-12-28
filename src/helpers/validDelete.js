//function checks whether a delete is allowed based on the roles, and the equality of the requester and the poster(the resource creator)
export default function validDelete(requester, poster, roles) {
    if (requester === poster) return true
    else return roles.includes("admin")
}