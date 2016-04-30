var test = require('tape')
var BehaviorContainer = require('../lib/behavior-container')

test('BehaviorContainer#set', function (assert) {
  var actual
  var expected
  var obj
  var container
  var Behavior

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { create: function (obj) { obj.val += 10 } }
  container.set('b', Behavior)

  actual = obj.val
  expected = 10
  assert.equal(actual, expected, 'should call the method `.create` (if exists) of the added behavior')

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = {
    options: { x: 10, y: 0 },
    create: function (obj, opts) { obj.val = opts.x + opts.y }
  }
  container.set('b', Behavior, { y: 990 })

  actual = obj.val
  expected = 1000 // 10 + 990
  assert.equal(actual, expected, 'have a third argument that should extend and overrides the default `.options` of behavior')

  assert.end()
})

test('BehaviorContainer#remove', function (assert) {
  var actual
  var expected
  var obj
  var container
  var Behavior

  obj = { val: 999 }
  container = new BehaviorContainer(obj)
  Behavior = { destroy: function (obj) { obj.val = 0 } }
  container.set('b', Behavior)
  container.remove('b')

  actual = obj.val
  expected = 0
  assert.equal(actual, expected, 'should call the method `.destroy` (if exists) of the removed behavior')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('xxx', Behavior)
  container.remove('xxx')

  actual = container.has('xxx')
  expected = false
  assert.equal(actual, expected, 'should erase the key used by the removed behavior')

  obj = { val: 0}
  container = new BehaviorContainer(obj)
  Behavior = { update: function (obj) { obj.val += 100 } }
  container.set('test', Behavior)
  container.remove('test')
  container.process('update')

  actual = obj.val
  expected = 0
  assert.equal(actual, expected, 'should make the methods of the removed behavior don\'t be called by `.process`')

  assert.end()
})

test('BehaviorContainer#has', function (assert) {
  var actual
  var expected
  var obj
  var container
  var Behavior

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = { /* do nothing */ }
  container.set('exists', Behavior)

  actual = container.has('exists')
  expected = true
  assert.equal(actual, expected, 'should returns a `true` when the key exists')

  obj = {}
  container = new BehaviorContainer(obj)

  actual = container.has('not exists')
  expected = false
  assert.equal(actual, expected, 'should returns a `true` when the key exists')

  assert.end()
})

test('BehaviorContainer#get', function (assert) {
  var actual
  var expected
  var obj
  var container
  var Behavior
  var key

  obj = {}
  container = new BehaviorContainer(obj)

  actual = container.get('test')
  expected = undefined
  assert.equal(actual, expected, 'should returns `undefined` when an unknow key is passed')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = { /* do nothing */ }
  key = 'the key'
  container.set(key, Behavior)

  actual = container.get(key).options.$key
  expected = key
  assert.equal(actual, expected, 'should returns an instance (copy) of behavior when the key exists')

  assert.end()
})

test('BehaviorContainer#process', function (assert) {
  var actual
  var expected
  var obj
  var container
  var Behavior1
  var Behavior2

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior1 = {
    update: function (obj) {
      obj.val += 20
    }
  }
  Behavior2 = {
    update: function (obj) {
      obj.val += 10
    }
  }
  container.set('b1', Behavior1)
  container.set('b2', Behavior2)
  container.process('update')

  actual = obj.val
  expected = 30
  assert.equal(actual, expected, 'should call the determined method (first argument) from ALL behaviors on THIS container')

  assert.end()
})

