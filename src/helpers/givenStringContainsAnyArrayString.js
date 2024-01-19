//checks whether a keyword is present in any string in an array of strings.

export default function givenStringContainsAnyArrayString(arr, keyword) {
    keyword = keyword.toLowerCase()
    for (let i = 0; i < arr.length; i++) {
        if (keyword.includes(arr[i].toLowerCase())) return true
    }
    return false
}