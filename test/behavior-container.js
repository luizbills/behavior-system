var test = require('tape')
var BehaviorContainer = require('../lib/behavior-container')

test('Behaviorcontainer.set', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior,
    key

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { create: (obj) => (obj.val = 10) }
  container.set('b', Behavior)
  actual = obj.val
  expected = 10
  assert.equal(actual, expected, 'should call the method `create` (if exists) of the newly behavior instance')

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = {
    options: { val: 10 },
    create: (obj, opts) => (obj.val = opts.val)
  }
  container.set('b', Behavior, { val: 20 })
  actual = obj.val
  expected = 20
  assert.equal(actual, expected, 'have a third argument that should extend and overrides the default `.options` of behavior model')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  key = 'a'
  actual = container.set(key, Behavior)
  expected = key
  assert.equal(actual, expected, 'should return the key of newly created behavior instance')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  key = ''
  actual = container.set(key, Behavior)
  expected = false
  assert.equal(actual, expected, 'should returns false if the key.length == 0')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  key = 'b'
  container.set(key, Behavior)
  actual = container.set(key, Behavior)
  expected = false
  assert.equal(actual, expected, 'should returns false if the object already has added a behavior using the key')

  assert.end()
})

test('BehaviorContainer#remove', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { destroy: (obj) => (obj.val = 10) }
  container.set('b', Behavior)
  container.remove('b')
  actual = obj.val
  expected = 10
  assert.equal(actual, expected, 'should call the method `destroy` (if exists) of the removed behavior instance')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  actual = container.remove('b')
  expected = true
  assert.equal(actual, expected, 'should return true when have a behavior instance to remove')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  container.remove('b')
  actual = container.remove('b')
  expected = false
  assert.equal(actual, expected, 'should return false when not have a behavior instance to remove')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  container.remove('b')
  actual = container.has('b')
  expected = false
  assert.equal(actual, expected, 'should remove the behavior instance of object')

  assert.end()
})

test('BehaviorContainer#removeAll', function (assert) {
  let actual,
    expected,
    obj,
    container

  obj = {}
  container = new BehaviorContainer(obj)
  container.set('b', {})
  container.set('b2', {})
  container.set('b3', {})
  container.removeAll()
  actual = [container.has('b'), container.has('b2'), container.has('b3')]
  expected = [false, false, false]
  assert.deepEqual(actual, expected, 'should remove all behavior instances of object')

  assert.end()
})

test('BehaviorContainer#has', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  actual = container.has('b')
  expected = true
  assert.equal(actual, expected, 'should returns true when the key exists')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  container.remove('b')
  actual = container.has('b')
  expected = false
  assert.equal(actual, expected, 'should returns false when the key not exists')

  assert.end()
})

test('BehaviorContainer#pause', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {
    x: 10
  }
  container = new BehaviorContainer(obj)
  Behavior = {
    change: (obj) => (obj.x = 20)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.process('b', 'change')
  actual = obj.x
  expected = 10
  assert.equal(actual, expected, 'should not process/call methods of a paused behavior instance')

  obj = {
    x: 0
  }
  container = new BehaviorContainer(obj)
  Behavior = {
    paused: (obj) => (obj.x = 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  actual = obj.x
  expected = 10
  assert.equal(actual, expected, 'should call the method `paused` (if exists) of the paused behavior instance')

  obj = {
    x: 0
  }
  container = new BehaviorContainer(obj)
  Behavior = {
    paused: (obj) => (obj.x += 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.pause('b')
  container.pause('b')
  actual = obj.x
  expected = 10
  assert.equal(actual, expected, 'should not call the method `paused` (if exists) again of a already paused behavior instance')

  assert.end()
})

test('BehaviorContainer#resume', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {
    x: 0
  }
  container = new BehaviorContainer(obj)
  Behavior = {
    resumed: (obj) => (obj.x = 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.resume('b')
  actual = obj.x
  expected = 10
  assert.equal(actual, expected, 'should call the method `resumed` (if exists) of the resumed behavior instance')

  obj = {
    x: 0
  }
  container = new BehaviorContainer(obj)
  Behavior = {
    resumed: (obj) => (obj.x += 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.resume('b')
  container.resume('b')
  actual = obj.x
  expected = 10
  assert.equal(actual, expected, 'should not call the method `resumed` (if exists) again of a already resumed behavior instance')

  assert.end()
})

test('BehaviorContainer#pauseAll', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b1', Behavior)
  container.set('b2', Behavior)
  container.pauseAll()
  actual = container.isPaused('b1') && container.isPaused('b2')
  expected = true
  assert.equal(actual, expected, 'should pause all behavior instance of the instance')

  assert.end()
})

test('BehaviorContainer#pauseAll', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b1', Behavior)
  container.set('b2', Behavior)
  container.pause('b1')
  container.pause('b2')
  container.resumeAll()
  actual = !container.isPaused('b1') && !container.isPaused('b2')
  expected = true
  assert.equal(actual, expected, 'should resume/unpause all behavior instance of the instance')

  assert.end()
})

test('BehaviorContainer#isPause', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('b', Behavior)
  container.pause('b')
  actual = container.isPaused('b')
  expected = true
  assert.equal(actual, expected, 'should returns true when the key is paused')

  obj = {}
  container = new BehaviorContainer(obj)
  Behavior = {}
  container.set('bb', Behavior)
  actual = container.isPaused('bb')
  container.pause('b')
  container.resume('b')
  expected = false
  assert.equal(actual, expected, 'should returns false when the key is not paused')

  assert.end()
})

test('BehaviorContainer#process', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { update: (obj) => (obj.val = 10) }
  container.set('b', Behavior)
  container.process('b', 'update')
  actual = obj.val
  expected = 10
  assert.equal(actual, expected, 'should call the determined method (second argument) from behavior with the key (first argument) of the container')

  const extras = [1, 2, 3, 4]
  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { update: (obj, opts, a, b, c, d) => (obj.val = [a, c, b, d]) }
  container.set('b', Behavior)
  container.process('b', 'update', extras[0], extras[2], extras[1], extras[3])
  actual = obj.val
  expected = extras
  assert.deepEqual(actual, expected, 'should pass extra arguments to the methods')

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = { update: (obj) => (obj.val = 10) }
  container.set('b', Behavior)
  container.remove('b')
  container.process('b', 'update')
  actual = obj.val
  expected = 0
  assert.deepEqual(actual, expected, 'don\'t should call the method of removed behavior instances')

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = {
    update (obj) {
      obj.val = 10
      return obj.val
    }
  }
  container.set('b', Behavior)
  actual = container.process('b', 'update')
  expected = 10
  assert.deepEqual(actual, expected, 'the methods can return values')

  assert.end()
})

test('BehaviorContainer#processAll', function (assert) {
  let actual,
    expected,
    obj,
    container,
    Behavior,
    Behavior2

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = {
    update: function (obj) {
      obj.val += 10
    }
  }
  container.set('b', Behavior)
  Behavior2 = {
    update: function (obj) {
      obj.val += 100
    }
  }
  container.set('b2', Behavior2)
  container.processAll('update')
  actual = obj.val
  expected = 110
  assert.equal(actual, expected, 'should call the determined method (first argument) from ALL behaviors of the container')

  obj = { val: 0 }
  container = new BehaviorContainer(obj)
  Behavior = {
    update: function (obj) {
      obj.val += 10
    }
  }
  container.set('b', Behavior)
  Behavior2 = {
    update: function (obj) {
      obj.val += 100
    }
  }
  container.set('b2', Behavior2)
  container.remove('b')
  container.processAll('update')
  actual = obj.val
  expected = 100
  assert.deepEqual(actual, expected, 'don\'t should call the method of removed behavior instances')

  assert.end()
})
