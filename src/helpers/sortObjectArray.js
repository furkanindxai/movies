//sorts based on a property of an object
export default function sortObjectArray(arr, field, order) {
    if (field === "releaseYear") {
        if (order === "asc") {
            arr.sort((a, b) => a[field] - b[field]);
        }
        else if (order === "dsc") {
            arr.sort((a, b) => b[field] - a[field]);

        }
        return arr
        
    }
    else if (field === "title") {
        if (order === "asc") {
            arr.sort((a, b) => a[field].toLowerCase().localeCompare(b[field].toLowerCase(), 'en', { numeric: true }))
        }
        else if (order === "dsc"){
            arr.sort((a, b) => b[field].toLowerCase().localeCompare(a[field].toLowerCase(), 'en', { numeric: true }))

        }
        return arr
    }
}