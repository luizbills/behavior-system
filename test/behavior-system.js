var test = require('tape')
var BehaviorSystem = require('../lib/behavior-system')
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
  var obj
  var initial

  obj = {}
  system.enable(obj)
  system.disable(obj)

  actual = obj.behaviors
  expected = void 0 // undefined
  assert.equal(actual, expected, 'should set .behaviors to undefined of the object')

  actual = system.disable(obj)
  expected = obj
  assert.equal(actual, expected, 'should returns the object')

  initial = 0
  obj = { val: initial }
  system.enable(obj)
  obj.behaviors.set('b', {
    update: function (obj) { obj.val += 5 }
  })
  system.disable(obj)
  system.processAll('update')

  actual = obj.val
  expected = initial
  assert.equal(actual, expected, 'should remove the object of the list of enabled objects')

  assert.end()
})

test('BehaviorSystem#processAll', function (assert) {
  var actual
  var expected
  var obj1 = { val: 5 }
  var obj2 = { val: 10 }

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

  system.enable(obj1)
  obj1.behaviors.set('b1', Behavior1)
  obj1.behaviors.set('b2', Behavior2)
  system.enable(obj2)
  obj2.behaviors.set('b1', Behavior1)
  obj2.behaviors.set('b2', Behavior2)
  system.processAll('update')

  actual = [obj1.val, obj2.val]
  expected = [30, 35] // [(5 + 10 + 15), (10 + 10 + 15)]
  assert.deepEqual(actual, expected, 'should call the determined method (first argument) from ALL behaviors in ALL enabled object by THIS system')

  assert.end()
})
