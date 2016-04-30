var test = require('tape')
var Recycler = require('../lib/helper/recycler')

test('Recycler#constructor', function (assert) {
  var actual
  var expected
  var list = new Recycler()

  list = new Recycler()
  actual = list.iterable.length
  expected = 0
  assert.equal(actual, expected, 'when used without arguments should initialize `.iterable` with a empty array')

  var array = [1, 2, 3, 4]
  list = new Recycler(array)
  actual = list.iterable
  expected = array
  assert.deepEqual(actual, expected, 'when used with an array should initialize `.iterable` with a "copy" of this array')

  assert.end()
})

test('Recycler#push', function (assert) {
  var actual
  var expected
  var list = new Recycler()
  var value

  value = 55
  actual = list.push(value)
  expected = list.iterable.length
  assert.equal(actual, expected, 'should returns the length of `.iterable`')

  value = 845
  expected = list.getNextIndex()
  list.push(value)
  actual = list.iterable.indexOf(value)
  assert.equal(actual, expected, 'should add an value on next avaliable index')

  assert.end()
})

test('Recycler#remove', function (assert) {
  var actual
  var expected
  var list
  var index
  var array

  array = [1, 2, 3, 4, 5, 6, 7]
  list = new Recycler(array)
  index = 2
  list.remove(index)
  actual = list.iterable[index]
  expected = undefined
  assert.equal(actual, expected, 'should set the index of `.iterable` to undefined')

  array = [1, 2, 3, 4, 5, 6, 7]
  list = new Recycler(array)
  index = 1
  actual = list.remove(index)
  expected = array[index]
  assert.equal(actual, expected, 'should returns the value of removed index')

  array = [1, 2, 3, 4, 5, 6, 7]
  list = new Recycler(array)
  index = 5
  list.remove(index)
  actual = index
  expected = list.getNextIndex()
  assert.equal(actual, expected, 'should recycle the removed index (turning the next avaliable index)')

  assert.end()
})

test('Recycler#pop', function (assert) {
  // actually not need to be tested
  assert.end()
})

test('Recycler#getNextIndex', function (assert) {
  // tested on tests of 'Recycler#push'
  assert.end()
})


