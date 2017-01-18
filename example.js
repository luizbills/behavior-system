var BehaviorSystem = require('./lib/behavior-system')

var Movement = {
	options: {
		// default settings
		speedX: 0,
		speedY: 0
	},

	update: function (entity, opts) {
		// entity is a object with the behavior
  		// opts is a object with the settings of this behavior instance
		entity.x += opts.speedX
  		entity.y += opts.speedY

  		return entity
	},

	position: function (entity, opts) {
		// you can return values in any behavior method
  		return { x: entity.x, y: entity.y }
	},
}

// create a system to control all objects with behaviors
var system = new BehaviorSystem()

// a simple game object
var entity = { x: 0, y: 0 }

// enable this entity to use behaviors
system.enable(entity)

// to add a behavior you need choice a unique name (a key) to this instance on entity
// (your entities can have many instances of a same behavior, just choose differents keys)
var key = 'movement'

// in this instance `options.speedX` will be 1, instead of 0 (default)
var settings = { speedX: 1 }
entity.behaviors.set(key, Movement, settings)

console.log(entity) // => { x: 0, y: 0, behaviors: {...} }

// call the method 'update' of a behavior with the key 'movement' in this entity
entity.behaviors.process('movement', 'update')

// call the method 'update' of all behaviors in this entity
entity.behaviors.processAll('update')

// call the method 'update' of all entities enabled by this system
system.globalProcessAll('update')

// remember: you can return values in any behavior method
var position = entity.behaviors.process('movement', 'position')
console.log('final position:', position) // => { x: 3, y: 0 }

// remove the behavior with name/key ("movement") used before
entity.behaviors.remove('movement')

console.log('the entity has a key "movement"?', entity.behaviors.has('movement') ? 'yes' : 'no')

// or
// remove all 'Movement' behavior instances in this entity
entity.behaviors.remove(Movement)
