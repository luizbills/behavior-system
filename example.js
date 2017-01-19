const BehaviorSystem = require('behavior-system')

const Movement = {
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
	},

	position: function (entity, opts) {
		// you can return values in any behavior method
		return { x: entity.x, y: entity.y }
	},

	create: function (entity, opts) {
		// called when an instance of this Behavior is added on a game object
		console.log('created a BehaviorMovement with key:', opts.$key)
		// hint: opts.$key is avaliable in any behavior instance
	},

	destroy: function (entity, opts) {
		// called when an instance of this Behavior is removed of a game object
		console.log('destroyed a BehaviorMovement with key:', opts.$key)
	},
}

// create a system to control all objects with behaviors
const system = new BehaviorSystem()

// a simple game object
const entity = { x: 0, y: 0 }

// enable this entity to use behaviors
system.enable(entity)

// to add a behavior you need choice a unique name (a key) to this instance on entity
// (your entities can have many instances of a same behavior, just choose differents keys)
const key = 'mov'

// in this instance `options.speedX` will be 1, instead of 0 (default)
const settings = { speedX: 1 }
entity.behaviors.set(key, Movement, settings)

console.log(entity) // => { x: 0, y: 0, {...} }

// call the method 'update' of a behavior with the key 'mov' in this entity
entity.behaviors.process('mov', 'update')

// call the method 'update' of all behaviors in this entity
entity.behaviors.processAll('update')

// call the method 'update' of all entities enabled by this system
system.globalProcessAll('update')

// remember: you can return values in any behavior method
const position = entity.behaviors.process('mov', 'position')
console.log('final position:', position) // => { x: 3, y: 0 }

// remove the behavior with name/key ("mov") used before
entity.behaviors.remove('mov')
// or
// remove all behavior instances of this entity
entity.behaviors.removeAll()

// check a key with `.has`
console.log('the entity has a key "mov"?', entity.behaviors.has('mov') ? 'yes' : 'no')

// When you no longer need a entity use the `system.disable`
system.disable(entity)
