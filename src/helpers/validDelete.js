export default function validDelete(requester, poster, roles) {
    if (requester === poster) return true
    else return roles.includes("admin")
}