const test = require('tape')
const BehaviorSystem = require('../lib/behavior-system')

test('BehaviorSystem#enable', function (assert) {
  const system = new BehaviorSystem()
  let actual
  let expected
  let obj
  let value

  obj = {}
  system.enable(obj)
  actual = obj.behaviors
  expected = undefined
  assert.notEqual(actual, expected, 'should add the property "behaviors" in the object')

  obj = {}
  actual = system.enable(obj)
  expected = true
  assert.equal(actual, expected, 'should returns true when the property "behaviors" is defined by the system')

  obj = {}
  system.enable(obj)
  actual = system.enable(obj) // already enabled
  expected = false
  assert.equal(actual, expected, 'should returns false when the property "behaviors" is already defined')

  value = 5
  obj = { val: value }
  system.enable(obj)
  obj.behaviors.set('b', { update: (obj) => (obj.val = value) })
  system.globalProcessAll('update')
  actual = obj.val
  expected = value
  assert.equal(actual, expected, 'should add the object to the list of enabled objects by the system')

  assert.end()
})

test('BehaviorSystem#disable', function (assert) {
  const system = new BehaviorSystem()
  let actual
  let expected
  let obj
  let initial

  obj = {}
  system.enable(obj)
  system.disable(obj)
  actual = obj.behaviors
  expected = undefined
  assert.equal(actual, expected, 'should set the property "behaviors" in the object to "undefined" if the object was enabled by the system')

  obj = {}
  system.enable(obj)
  actual = system.disable(obj)
  expected = true
  assert.equal(actual, expected, 'should returns true when the system can disable the object')

  obj = {}
  system.enable(obj)
  system.disable(obj)
  actual = system.disable(obj)
  expected = false
  assert.equal(actual, expected, 'should returns false when the object is already disabled')

  initial = 0
  obj = { val: initial }
  system.enable(obj)
  obj.behaviors.set('b', {
    update: function (obj) { obj.val = 5 }
  })
  system.disable(obj)
  system.globalProcessAll('update')
  actual = obj.val
  expected = initial
  assert.equal(actual, expected, 'should remove the object of the list of enabled objects by the system')

  obj = { val: 0 }
  system.enable(obj)
  obj.behaviors.set('b', { destroy: (obj) => (obj.val += 10) })
  obj.behaviors.set('b2', { destroy: (obj) => (obj.val += 10) })
  obj.behaviors.set('b3', { destroy: (obj) => (obj.val += 10) })
  system.disable(obj)
  actual = obj.val
  expected = 30
  assert.equal(actual, expected, 'should remove and call the method "destroy" of all behavior instances of object when the system can disable the object')

  assert.end()
})

test('BehaviorSystem#globalProcessAll', function (assert) {
  const system = new BehaviorSystem()
  let actual
  let expected
  let obj1
  let obj2

  obj1 = { val: 0 }
  system.enable(obj1)
  obj1.behaviors.set('b', { update: (obj) => (obj.val = 10) })
  obj1.behaviors.set('b2', {
    // this don't will run
    update: (obj) => (obj.val = 1000)
  })
  obj1.behaviors.remove('b2')

  obj2 = { val: 0 }
  system.enable(obj2)
  obj2.behaviors.set('b', { update: (obj) => (obj.val = 20) })

  system.globalProcessAll('update')
  actual = [obj1.val, obj2.val]
  expected = [10, 20]
  assert.deepEqual(actual, expected, 'should call the determined method (first argument) of ALL behaviors in ALL enabled object by THIS system')

  assert.end()
})
