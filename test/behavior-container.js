var test = require('tape')
var BehaviorContainer = require('../lib/behavior-container')

test('BehaviorContainer#set', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior,
    key

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = { $create: (entity) => ++entity.val }
  container.set('b', Behavior)
  actual = entity.val
  expected = 1
  assert.equal(actual, expected, 'should call the method `$create` (if exists) of the newly behavior instance')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {
    options: { val: 10 },
    $create: (entity, opts) => (entity.val = opts.val)
  }
  container.set('b', Behavior)
  actual = entity.val
  expected = 10
  assert.equal(actual, expected, 'should extend the default `.options` of behavior if a third parameter is omitted.')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {
    options: { val: 10 },
    $create: (entity, opts) => (entity.val = opts.val)
  }
  container.set('b', Behavior, { val: 20 })
  actual = entity.val
  expected = 20
  assert.equal(actual, expected, 'should extend and overrides the default `.options` of behavior with the third parameter (if present).')

  entity = { o: null }
  container = new BehaviorContainer(entity)
  Behavior = {
    $create: (entity, opts) => (entity.o = opts)
  }
  container.set('b', Behavior)
  actual = JSON.stringify(entity.o)
  expected = JSON.stringify({ $key: 'b' })
  assert.equal(actual, expected, 'should create a object with only the $key property if the behavior has not a `.options` and the third parameter is omitted.')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  key = 'a'
  actual = container.set(key, Behavior)
  expected = key
  assert.equal(actual, expected, 'should return the key of newly created behavior instance')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  // try to add again with same key
  actual = container.set('b', Behavior)
  expected = false
  assert.equal(actual, expected, 'should returns false if the entity already has added a behavior using the which key')

  assert.end()
})

test('BehaviorContainer#remove', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = { $destroy: (entity) => (entity.val = 10) }
  container.set('b', Behavior)
  container.remove('b')
  actual = entity.val
  expected = 10
  assert.equal(actual, expected, 'should call the method `$destroy` (if exists) of the removed behavior instance')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  actual = container.remove('b')
  expected = true
  assert.equal(actual, expected, 'should return true when have a behavior instance to remove')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  container.remove('b')
  actual = container.remove('b')
  expected = false
  assert.equal(actual, expected, 'should return false when not have a behavior instance to remove')

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  container.remove('b')
  actual = container.has('b')
  expected = false
  assert.equal(actual, expected, 'should remove the behavior instance of entity')

  assert.end()
})

test('BehaviorContainer#removeAll', function (assert) {
  let actual,
    expected,
    entity,
    container

  entity = {}
  container = new BehaviorContainer(entity)
  container.set('b', {})
  container.set('b2', {})
  container.set('b3', {})
  container.removeAll()
  actual = [container.has('b'), container.has('b2'), container.has('b3')]
  expected = [false, false, false]
  assert.deepEqual(actual, expected, 'should remove all behavior instances of entity')

  assert.end()
})

test('BehaviorContainer#has', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  actual = container.has('b')
  expected = true
  assert.equal(actual, expected, 'should returns true when the key exists')

  entity = {}
  container = new BehaviorContainer(entity)
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
    entity,
    container,
    Behavior

  entity = {
    x: 10
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    change: (entity) => (entity.x = 20)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.process('b', 'change')
  actual = entity.x
  expected = 10
  assert.equal(actual, expected, 'should not process/call methods of a paused behavior instance')

  entity = {
    x: 0
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    $pause: (entity) => (entity.x = 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  actual = entity.x
  expected = 10
  assert.equal(actual, expected, 'should call the `$pause` method (if exists) of the paused behavior instance')

  entity = {
    x: 0
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    $pause: (entity) => (entity.x += 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.pause('b')
  container.pause('b')
  actual = entity.x
  expected = 10
  assert.equal(actual, expected, 'should not call the `$pause` method (if exists) again of a already paused behavior instance')

  assert.end()
})

test('BehaviorContainer#resume', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {
    x: 0
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    $resume: (entity) => (entity.x = 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.resume('b')
  actual = entity.x
  expected = 10
  assert.equal(actual, expected, 'should call the `$resume` method (if exists) of the resumed behavior instance')

  entity = {
    x: 0
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    $resume: (entity) => (entity.x += 10)
  }
  container.set('b', Behavior)
  container.pause('b')
  container.resume('b')
  container.resume('b')
  actual = entity.x
  expected = 10
  assert.equal(actual, expected, 'should not call the `$resume` method (if exists) again of a already resumed behavior instance')

  assert.end()
})

test('BehaviorContainer#toogle', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {
    x: 0
  }
  container = new BehaviorContainer(entity)
  Behavior = {
    $pause: (entity) => (entity.x += 10),
    $resume: (entity) => (entity.x += 10)
  }
  container.set('b', Behavior)
  container.toogle('b')
  container.toogle('b')
  
  actual = entity.x
  expected = 20
  assert.equal(actual, expected, 'should call .pause if paused or .resume if not paused')
  
  assert.end()
})

test('BehaviorContainer#pauseAll', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b1', Behavior)
  container.set('b2', Behavior)
  container.pauseAll()
  actual = [container.isPaused('b1'), container.isPaused('b2')]
  expected = [true, true]
  assert.deepEqual(actual, expected, 'should pause all behavior instance of the instance')

  assert.end()
})

test('BehaviorContainer#resumeAll', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b1', Behavior)
  container.set('b2', Behavior)
  container.pause('b1')
  container.pause('b2')
  container.resumeAll()
  actual = [!container.isPaused('b1'), !container.isPaused('b2')]
  expected = [true, true]
  assert.deepEqual(actual, expected, 'should resume/unpause all behavior instance of the instance')

  assert.end()
})

test('BehaviorContainer#isPause', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior

  entity = {}
  container = new BehaviorContainer(entity)
  Behavior = {}
  container.set('b', Behavior)
  container.pause('b')
  actual = container.isPaused('b')
  expected = true
  assert.equal(actual, expected, 'should returns true when the key is paused')

  entity = {}
  container = new BehaviorContainer(entity)
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
    entity,
    container,
    Behavior,
    extras

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity) => (entity.val = 10) }
  container.set('b', Behavior)
  container.process('b', 'update')
  actual = entity.val
  expected = 10
  assert.equal(actual, expected, 'should call the determined method (second argument) from behavior with the key (first argument) of the container')

  extras = [1]
  entity = { val: null }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity, opts, a) => (entity.val = [a]) }
  container.set('b', Behavior)
  container.process('b', 'update', ...extras)
  actual = entity.val
  expected = extras
  assert.deepEqual(actual, expected, 'should accept 1 extra argument')

  extras = [1, 2]
  entity = { val: null }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity, opts, a, b) => (entity.val = [a, b]) }
  container.set('b', Behavior)
  container.process('b', 'update', ...extras)
  actual = entity.val
  expected = extras
  assert.deepEqual(actual, expected, 'should accept 2 extra arguments')

  extras = [1, 2, 3]
  entity = { val: null }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity, opts, a, b, c) => (entity.val = [a, b, c]) }
  container.set('b', Behavior)
  container.process('b', 'update', ...extras)
  actual = entity.val
  expected = extras
  assert.deepEqual(actual, expected, 'should accept 3 extra arguments')

  extras = [1, 2, 3, 4]
  entity = { val: null }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity, opts, a, b, c, d) => (entity.val = [a, b, c, d]) }
  container.set('b', Behavior)
  container.process('b', 'update', ...extras)
  actual = entity.val
  expected = extras
  assert.deepEqual(actual, expected, 'should accept 4 or more extra arguments')

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = { update: (entity) => (entity.val = 10) }
  container.set('b', Behavior)
  container.remove('b')
  container.process('b', 'update')
  actual = entity.val
  expected = 0
  assert.equal(actual, expected, 'don\'t should call the method of removed behavior instances')

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = {
    update (entity) {
      entity.val = 10
      return 'ok'
    }
  }
  container.set('b', Behavior)
  actual = container.process('b', 'update')
  expected = 'ok'
  assert.equal(actual, expected, 'the methods/actions of a behavior can return values when called with ".process"')

  assert.end()
})

test('BehaviorContainer#processAll', function (assert) {
  let actual,
    expected,
    entity,
    container,
    Behavior,
    Behavior2

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = {
    update: function (entity) {
      entity.val += 10
    }
  }
  container.set('b', Behavior)
  Behavior2 = {
    update: function (entity) {
      entity.val += 100
    }
  }
  container.set('b2', Behavior2)
  container.processAll('update')
  actual = entity.val
  expected = 110
  assert.equal(actual, expected, 'should call the determined method (first argument) from ALL behaviors of the container')

  entity = { val: 0 }
  container = new BehaviorContainer(entity)
  Behavior = {
    update: function (entity) {
      entity.val += 10
    }
  }
  container.set('b', Behavior)
  Behavior2 = {
    update: function (entity) {
      entity.val += 100
    }
  }
  container.set('b2', Behavior2)
  container.remove('b')
  container.processAll('update')
  actual = entity.val
  expected = 100
  assert.deepEqual(actual, expected, 'don\'t should call the method of removed behavior instances')

  assert.end()
})
