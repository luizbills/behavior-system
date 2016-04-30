var test = require('tape')
var BehaviorSystem = require('../')
var system = new BehaviorSystem()

test('BehaviorSystem#enable', function (assert) {
  var actual
  var expected
  var obj = {}

  system.enable(obj)

  actual = 'behaviors' in obj
  expected = true
  assert.equal(actual, expected, 'should add .behaviors to the object')

  actual = system.enable(obj)
  expected = obj
  assert.equal(actual, expected, 'should returns the object enabled')

  assert.end()
})

test('BehaviorSystem#disable', function (assert) {
  var actual
  var expected
  var obj = { behaviors: {} }

  system.disable(obj)

  actual = obj.behaviors
  expected = void 0 // undefined
  assert.equal(actual, expected, 'should set .behaviors to undefined of the object')

  actual = system.disable(obj)
  expected = obj
  assert.equal(actual, expected, 'should returns the object enabled')

  assert.end()
})

test('BehaviorSystem#processAll', function (assert) {
  var actual
  var expected
  var obj = { val: 5 }

  var Behavior1 = {
    update: function (obj) {
      obj.val += 15
    }
  }
  var Behavior2 = {
    update: function (obj) {
      obj.val += 10
    }
  }

  system.enable(obj)
  obj.behaviors.set('b1', Behavior1)
  obj.behaviors.set('b2', Behavior2)
  system.processAll('update')

  actual = obj.val
  expected = 30 // 5 + 10 + 15
  assert.equal(actual, expected, 'should call ALL ".update" methods from ALL behaviors in ALL enabled object')

  assert.end()
})
