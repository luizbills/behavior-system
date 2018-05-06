const test = require('tape')
const BehaviorSystem = require('../lib/behavior-system')

test('BehaviorSystem#enable', function (assert) {
  let system = new BehaviorSystem()
  let actual
  let expected
  let entity

  entity = {}
  system.enable(entity)
  actual = entity.behaviors
  expected = undefined
  assert.notEqual(actual, expected, 'should add a ".behaviors" property in the entity')

  entity = {}
  actual = system.enable(entity)
  expected = true
  assert.equal(actual, expected, 'should returns true when a ".behaviors" property is defined by the system')

  entity = {}
  system.enable(entity)
  actual = system.enable(entity) // already enabled
  expected = false
  assert.equal(actual, expected, 'should returns false when a ".behaviors" property is already defined')

  entity = { val: 0 }
  system.enable(entity)
  entity.behaviors.set('b', { update: (entity) => ++entity.val })
  system.globalProcessAll('update')
  actual = entity.val
  expected = 1
  assert.equal(actual, expected, 'should add the entity to the list of enabled entities by the system')

  system = new BehaviorSystem()
  entity = {}
  system.enable({})
  system.enable(entity)
  actual = entity.behaviors.getID()
  system.disable(entity)
  system.enable(entity)
  expected = 2
  assert.equal(actual, expected, 'should recycle the BehaviorContainer id of disabled entities')

  assert.end()
})

test('BehaviorSystem#disable', function (assert) {
  const system = new BehaviorSystem()
  let actual
  let expected
  let entity

  entity = {}
  system.enable(entity)
  system.disable(entity)
  actual = entity.behaviors
  expected = undefined
  assert.equal(actual, expected, 'should unset the ".behaviors" property in the entity, if the entity was enabled by the system')

  entity = {}
  system.enable(entity)
  actual = system.disable(entity)
  expected = true
  assert.equal(actual, expected, 'should returns true when the system successful disabled the entity')

  entity = {}
  system.enable(entity)
  system.disable(entity)
  actual = system.disable(entity)
  expected = false
  assert.equal(actual, expected, 'should returns false when the entity is already disabled by the system')

  entity = { val: 0 }
  system.enable(entity)
  entity.behaviors.set('b', {
    update: (entity) => entity.val++
  })
  system.disable(entity)
  system.globalProcessAll('update')
  actual = entity.val
  expected = 0
  assert.equal(actual, expected, 'should remove the entity of the list of enabled entities by the system')

  entity = { val: 0 }
  system.enable(entity)
  entity.behaviors.set('b', { destroy: (entity) => entity.val++ })
  entity.behaviors.set('b2', { destroy: (entity) => entity.val++ })
  entity.behaviors.set('b3', { destroy: (entity) => entity.val++ })
  system.disable(entity)
  actual = entity.val
  expected = 3
  assert.equal(actual, expected, 'should remove and call the method "destroy" of all behavior instances of entity when the system successful disabled the entity')

  assert.end()
})

test('BehaviorSystem#globalProcessAll', function (assert) {
  const system = new BehaviorSystem()
  let actual
  let expected
  let entity1
  let entity2

  const behavior = { update: (entity) => entity.val++ }

  entity1 = { val: 0 }
  system.enable(entity1)
  entity1.behaviors.set('b', behavior)

  entity2 = { val: 1 }
  system.enable(entity2)
  entity2.behaviors.set('b', behavior)
  system.disable(entity2)

  system.globalProcessAll('update')

  actual = [entity1.val, entity2.val]
  expected = [1, 1]
  assert.deepEqual(actual, expected, 'should call the wich method/action (first parameter) of ALL behaviors in ALL enabled entities by the system')

  assert.end()
})
