const removeByIndex = require('./helper/remove-by-index')

function BehaviorContainer (entity, system) {
  this.index = false
  this.entity = entity

  // use the 'key' to store informations of the instance
  this._storage = {}
  this._keys = []

  this.system = system
}

BehaviorContainer.prototype = {
  set (key, behavior, options = {}) {
    if (this.has(key)) return false

    // inherit and override
    const keyIndex = this._keys.push(key) - 1
    const opts = Object.assign(Object.create(null), behavior.options, options)
    opts.$key = key

    // store necessary informations and also the instance
    this._storage[key] = {
      name: key,
      index: keyIndex,
      behavior,
      paused: false,
      options: opts
    }

    // process "create" action of newly instance
    this.process(key, 'create')

    // returns the key of newly instance
    return key
  },

  remove (key) {
    if (!this.has(key)) return false

    const index = this._storage[key].index
    const list = this._keys
    const len = list.length
    const last = list[len - 1]

    // call method 'destroy' before really remove
    this.process(key, 'destroy')

    // remove from instance list
    if (len !== 1 && (index + 1) !== len) {
      this._storage[last].index = index
    }
    removeByIndex(list, index)

    delete this._storage[key]

    return true
  },

  removeAll () {
    const list = this._keys
    const len = list.length

    if (len === 0) return

    // reverse loop because it's necessary
    for (let i = len - 1; i !== -1; --i) {
      this.remove(list[i])
    }
  },

  has (key) {
    return typeof this._storage[key] !== 'undefined'
  },

  pause (key) {
    if (this.has(key) && !this.isPaused(key)) {
      // process `paused` before pause the instance
      this.process(key, 'paused')
      this._storage[key].paused = true
      return true
    }
    return false
  },

  resume (key) {
    if (this.has(key) && this.isPaused(key)) {
      this._storage[key].paused = false
      // process `resumed` after resume the instance
      this.process(key, 'resumed')
      return true
    }
    return false
  },

  pauseAll () {
    const list = this._keys
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.pause(list[i])
    }
  },

  resumeAll () {
    const list = this._keys
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.resume(list[i])
    }
  },

  isPaused (key) {
    return this._storage[key].paused
  },

  process (key, methodName, ...args) {
    if (!this.has(key) || this.isPaused(key)) return

    const entity = this.entity
    const data = this._storage[key]
    const method = data.behavior[methodName]
    const options = data.options
    let result

    if (typeof method === 'function') {
      switch (args.length) {
        case 0:
          return method(entity, options)

        case 1:
          return method(entity, options, args[0])

        case 2:
          return method(entity, options, args[0], args[1])

        case 3:
          return method(entity, options, args[0], args[1], args[2])

        default:
          return method.apply(false, [entity, options, ...args])
      }
    }

    return result
  },

  processAll (methodName, ...args) {
    const list = this._keys
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.process(list[i], methodName, ...args)
    }
  }

}

BehaviorContainer.prototype.constructor = constructor

module.exports = BehaviorContainer
