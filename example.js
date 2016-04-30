var BehaviorSystem = require('behavior-system')

var BehaviorMovement= {}
// Behavior settings
BehaviorMovement.options = {}
// Default velocity of the movement
BehaviorMovement.options.speedX = 2
BehaviorMovement.options.speedY = 4
// The 'update' method of our behavior
BehaviorMovement.update = function (entity, opts) {
  // entity is a object with the behavior
  // opts is a object with the settings of this behavior instance

  // the moviment
  entity.x += opts.speedX
  entity.y += opts.speedY
}

var system = new BehaviorSystem()

// a simple actor
var myEntity = { x: 0, y: 0 }
system.enable(myEntity)

// to add a behavior you need choice a unique name to this instance on entity
// (your game objects can have many instances of a same behavior, just choose differents names)
var name = 'movement'
// in this instance `options.speedX` will be 1, instead of 2 (default)
var customSettings = { speedX: 1 }
myEntity.behaviors.set(name, BehaviorMovement, customSettings)

console.log(myEntity) // => { x: 0, y: 0 }

system.processAll('update') // call the method update of ALL behavior on entities enabled for this system
system.processAll('update') // 2 times
system.processAll('update') // 3 times

console.log(myEntity) // => { x: 3, y: 12 }
myEntity.behaviors.remove('movement') // remove the behavior with name 'movement'

system.processAll('update')
system.processAll('update')
console.log(myEntity) // => { x: 3, y: 12 }
// no changes because this entity not have the MovementBehavior anymore
