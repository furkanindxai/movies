export default function validStringArray(arr) {
    if (!Array.isArray(arr)) return false
    else {
        if (arr.length === 0) return false
        else {
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] !== "string") return false
            }
            return true
        }
    }
}