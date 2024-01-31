//checks whether all elements in an array are strings
export default function validStringArray(arr) {
    if (!Array.isArray(arr)) return false
    else {
        if (arr.length === 0) return false
        else {
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] !== "string" || arr[i].includes(',')) return false
            }
            return true
        }
    }
}