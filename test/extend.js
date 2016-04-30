var test = require('tape')
var extend = require('../lib/helper/extend')

test('extend', function (assert) {
  var actual
  var expected
  var dest
  var source
  var res

  dest = {}

  actual = extend(dest)
  expected = dest
  assert.equal(actual, expected, 'ever returns the first argument')

  dest = {a: 1, b: 2}
  source = {c: 3}
  res = {a: 1, b: 2, c: 3}
  actual = extend(dest, source)
  expected = res
  assert.deepEqual(actual, expected, 'should populates the argument `dest` with the properties of `source`')

  dest = {a: 1, b: 5}
  source = {a: 4}
  res = {a: 4, b: 5}
  actual = extend(dest, source)
  expected = res
  assert.deepEqual(actual, expected, 'should make the properties of `source` overrides the properties of `dest`')

  assert.end()
})
