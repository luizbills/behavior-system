const test = require('tape')
const extend = require('../lib/helper/extend')

test('extend', function (assert) {
  let actual
  let expected
  let dest
  let source

  dest = {}
  actual = extend(dest)
  expected = dest
  assert.equal(actual, expected, 'should returns the first argument')

  dest = {}
  source = {a: 3}
  actual = extend(dest, source)
  expected = {a: 3}
  assert.deepEqual(actual, expected, 'should populates the first argument with the properties of second argument')

  dest = {a: 1}
  source = {a: 4}
  actual = extend(dest, source)
  expected = {a: 4}
  assert.deepEqual(actual, expected, 'should make the properties of second argument overrides the properties of first argument')

  assert.end()
})
