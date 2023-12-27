export default function paginate(arrayOfObjects, filter, filterValue, offset, limit) {
    arrayOfObjects = arrayOfObjects.filter(arrayObject=>arrayObject[filter] === filterValue)
    const startIndex = offset - 1;
    const endIndex = limit + startIndex;
    return arrayOfObjects.slice(startIndex, endIndex)
}
