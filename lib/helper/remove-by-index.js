// remove the element at 'index' and put the last element of array in the 'index' (if array.length > 1)
function removeByIndex (array, index) {
  const size = array.length
  if (size === 0 || index >= size || index < 0) return
  else if (size === 1 || (index + 1) === size) return array.pop()

  const value = array[index]
  array[index] = array.pop()

  return value
}

module.exports = removeByIndex
