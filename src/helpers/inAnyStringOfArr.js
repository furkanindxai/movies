//checks whether a keyword is present in any string in an array of strings.

export default function inAnyStringOfArr(arr, keyword) {
    keyword = keyword.toLowerCase()
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().includes(keyword)) return true
    }
    return false
}