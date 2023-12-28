//checks whether array2 has all the elements of array1 irrespective of order 
export default function arrayHasSameElements(arr1, arr2) {
    if (arr1.length > arr2.length) return false;
    else {
        return arr1.every((el) => {
                return arr2.includes(el)
            })
        }
        
}
