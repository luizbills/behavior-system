const removeByIndex = require('./helper/remove-by-index')

module.exports = class BehaviorContainer {
  constructor (entity, system, id) {
    this.entity = entity
    this._id = id

    this._behaviors = {}
    this._keys = []

    this.system = system
  }

  getID () {
    return this._id
  }

  set (key, behavior, options = {}) {
    if (this.has(key)) return false

    // inherit and override
    const keyIndex = this._keys.push(key) - 1
    const opts = Object.assign(Object.create(null), behavior.options, options)
    opts.$key = key

    // store necessary informations and also the instance
    this._behaviors[key] = {
      keyIndex,
      behavior,
      paused: false,
      options: opts
    }

    // process "create" action of newly instance
    this.process(key, '$create')

    // returns the key of newly instance
    return key
  }

  remove (key) {
    if (!this.has(key)) return false

    const index = this._behaviors[key].keyIndex
    const list = this._keys
    const len = list.length
    const last = list[len - 1]

    // call method 'destroy' before really remove
    this.process(key, '$destroy')

    // remove from instance list
    if (len !== 1 && (index + 1) !== len) {
      this._behaviors[last].keyIndex = index
    }
    removeByIndex(list, index)

    delete this._behaviors[key]

    return true
  }

  removeAll () {
    const list = this._keys

    // reverse loop because it's necessary
    for (let i = list.length - 1; i !== -1; --i) {
      this.remove(list[i])
    }
  }

  has (key) {
    return typeof this._behaviors[key] !== 'undefined'
  }

  pause (key) {
    if (this.has(key) && !this.isPaused(key)) {
      // process `paused` before pause the instance
      this.process(key, '$pause')
      this._behaviors[key].paused = true
      return true
    }
    return false
  }

  resume (key) {
    if (this.has(key) && this.isPaused(key)) {
      this._behaviors[key].paused = false
      // process `resumed` after resume the instance
      this.process(key, '$resume')
      return true
    }
    return false
  }

  toogle (key) {
    return this.isPaused(key) ? this.resume(key) : this.pause(key)
  }

  pauseAll () {
    const list = this._keys

    for (let i = 0; i < list.length; ++i) {
      this.pause(list[i])
    }
  }

  resumeAll () {
    const list = this._keys

    for (let i = 0; i < list.length; ++i) {
      this.resume(list[i])
    }
  }

  isPaused (key) {
    return this._behaviors[key].paused
  }

  process (key, methodName, ...args) {
    if (!this.has(key) || this.isPaused(key)) return

    const entity = this.entity
    const data = this._behaviors[key]
    const method = data.behavior[methodName]
    const options = data.options

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
  }

  processAll (methodName, ...args) {
    const list = this._keys

    for (let i = 0; i < list.length; ++i) {
      this.process(list[i], methodName, ...args)
    }
  }
}
