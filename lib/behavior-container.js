const extend = require('./helper/extend')
const removeByIndex = require('./helper/remove-by-index')

function BehaviorContainer (entity, system) {
  this.entity = entity

  // store options of the instances
  this._optionsList = []

  // use the 'key' to store informations of the instance
  this._infoList = {}

  // store paused instances
  this._pausedList = {}

  this.system = system
}

BehaviorContainer.prototype = {

  constructor: BehaviorContainer,

  index: 0,

  set (key, behavior, options) {
    if (this.has(key)) return false

    // inherit and override
    const defaults = extend({}, behavior.options)
    options = extend(defaults, options)
    options.$key = key

    // store necessary informations and also the instance
    this._infoList[key] = {
      behavior: behavior,
      index: this._optionsList.push(options) - 1
    }

    // process "create" action of newly instance
    this.process(key, 'create')

    // returns the key of newly instance
    return key
  },

  remove (key) {
    if (!this.has(key)) return false

    const index = this._infoList[key].index
    const list = this._optionsList
    const len = list.length
    const last = list[len - 1]

    // call method 'destroy' before really remove
    this.process(key, 'destroy')

    // remove from instance list
    if (len !== 1 && (index + 1) !== len) {
      this._infoList[last.$key].index = index;
    }
    removeByIndex(list, index)

    // remove from other lists
    this._pausedList[key] = false
    this._infoList[key] = false

    return true
  },

  removeAll () {
    const list = this._optionsList
    const len = list.length

    if (len === 0) return

    // reverse loop because it's necessary
    for (i = len - 1; i !== -1; --i) {
      this.remove(list[i].$key)
    }
  },

  has (key) {
    return typeof this._infoList[key] === 'object'
  },

  pause (key) {
    if (this.has(key) && !this.isPaused(key)) {
      // process `paused` before pause the instance
      this.process(key, 'paused')
      this._pausedList[key] = true
      return true
    }
    return false
  },

  resume (key) {
    if (this.has(key) && this.isPaused(key)) {
      this._pausedList[key] = false
      // process `resumed` after resume the instance
      this.process(key, 'resumed')
      return true
    }
    return false
  },

  pauseAll () {
    const list = this._optionsList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.pause(list[i].$key)
    }
  },

  resumeAll () {
    const list = this._optionsList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.resume(list[i].$key)
    }
  },

  isPaused (key) {
    return this._pausedList[key]
  },

  process (key, methodName, ...args) {
    if (!this.has(key) || this.isPaused(key)) return

    const info = this._infoList[key]
    const method = info.behavior[methodName]
    const entity = this.entity
    const options = this._optionsList[info.index]
    let result = false

    if (typeof method !== 'undefined') {
      switch(args.length) {
        case 0:
          result = method(entity, options)
          break
        case 1:
          result = method(entity, options, args[0])
          break
        case 2:
          result = method(entity, options, args[0], args[1])
          break
        case 3:
          result = method(entity, options, args[0], args[1], args[2])
          break
        default:
          result = method.apply(false, [entity, options, ...args])
          break
      }
    }

    return result
  },

  processAll (methodName, ...args) {
    const list = this._optionsList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.process(list[i].$key, methodName, ...args)
    }
  }

}

module.exports = BehaviorContainer
