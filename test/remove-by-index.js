var test = require('tape')
const removeByIndex = require('../lib/helper/remove-by-index')

test('removeByIndex', function (assert) {
  let actual
  let expected
  let source
  let index

  source = [1, 2, 3, 4, 5]
  index = 0
  actual = removeByIndex(source, index)
  expected = 1
  assert.equal(actual, expected, 'should returns the element of the index')

  source = [1, 2, 3, 4, 5]
  index = 0
  removeByIndex(source, index)
  actual = 5
  expected = source[index]
  assert.equal(actual, expected, 'should moves the last element to the index (if source.length > 1)')

  source = []
  index = 0
  actual = undefined
  expected = removeByIndex(source, index)
  assert.equal(actual, expected, 'should returns undefined if the array is empty')

  source = [1, 2, 3]
  index = source.length
  actual = undefined
  expected = removeByIndex(source, index)
  assert.equal(actual, expected, 'should returns undefined if the index == source.length')

  source = [1, 2, 3]
  index = source.length + 1
  actual = undefined
  expected = removeByIndex(source, index)
  assert.equal(actual, expected, 'should returns undefined if the index > source.length')

  source = [1, 2, 3]
  index = -1
  actual = undefined
  expected = removeByIndex(source, index)
  assert.equal(actual, expected, 'should returns undefined if the index < 0')

  assert.end()
})
