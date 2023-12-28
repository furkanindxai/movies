//function returns elements in paginated form based on limit and offset, filter and filterValue are used to filter the array of objects.
export default function paginate(arrayOfObjects, filter, filterValue, offset, limit) {
    arrayOfObjects = arrayOfObjects.filter(arrayObject=>arrayObject[filter] === filterValue)
    const startIndex = offset - 1;
    const endIndex = limit + startIndex;
    return arrayOfObjects.slice(startIndex, endIndex)
}
