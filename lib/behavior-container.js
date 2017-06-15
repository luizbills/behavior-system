const NULL = undefined // never use "null"
const extend = require('./helper/extend')
const removeByIndex = require('./helper/remove-by-index')

function BehaviorContainer (gameObject, parent) {
  this.gameObject = gameObject

  // store instances
  this._behaviorList = []

  // use the 'key' to store the index of the instances
  this._behaviorMap = {}

  // store paused instances
  this._pausedBehaviors = {}

  this.parent = parent
}

BehaviorContainer.prototype = {

  constructor: BehaviorContainer,

  index: NULL, // array index on system (defined by the system)

  set (key, behavior, options) {
    if (key.length === 0 || this.has(key)) return false

    const ref = Object.create(behavior)
    if (behavior.options !== NULL) {
      ref.options = extend(extend({}, behavior.options), options)
    } else {
      ref.options = extend({}, options)
    }
    ref.options.$key = key
    this._behaviorMap[key] = this._behaviorList.push(ref) - 1

    if (ref.create !== NULL) this.process(key, 'create')

    // returns the key of newly created behavior instance
    return key
  },

  remove (key) {
    if (!this.has(key)) return false

    const index = this._behaviorMap[key] // array index of the key
    const list = this._behaviorList
    const len = list.length
    const ref = list[index]
    const last = list[list.length - 1]

    // call method 'destroy' before
    if (ref.destroy !== NULL) this.process(key, 'destroy')

    this._behaviorMap[key] = NULL
    if (len !== 1 && (index + 1) !== len) {
      this._behaviorMap[last.options.$key] = index;
    }
    removeByIndex(this._behaviorList, index)

    // remove from paused list if necessary
    this._pausedBehaviors[key] = NULL

    return true
  },

  removeAll () {
    const list = this._behaviorList
    const len = list.length

    if (len === 0) return

    for (i = len - 1; i !== -1; --i) {
      this.remove(list[i].options.$key)
    }
  },

  has (key) {
    return this._behaviorMap[key] !== NULL
  },

  pause (key) {
    if (this.has(key) && !this.isPaused(key)) {
      // process `paused` before pause the instance
      this.process(key, 'paused')
      this._pausedBehaviors[key] = true
      return true
    }
    return false
  },

  pauseAll () {
    const list = this._behaviorList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.pause(list[i].options.$key)
    }
  },

  resume (key) {
    if (this.has(key) && this.isPaused(key)) {
      this._pausedBehaviors[key] = NULL
      // process `resumed` after resume the instance
      this.process(key, 'resumed')
      return true
    }
    return false
  },

  resumeAll () {
    const list = this._behaviorList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.resume(list[i].options.$key)
    }
  },

  isPaused (key) {
    return this._pausedBehaviors[key] !== NULL
  },

  process (key, methodName, ...args) {
    if (!this.has(key) || this.isPaused(key)) return

    const index = this._behaviorMap[key]
    const ref = this._behaviorList[index]
    const method = ref[methodName]
    const gameObject = this.gameObject
    const options = ref.options
    let result = NULL

    if (method !== NULL) {
      switch(args.length) {
        case 0:
          result = method(gameObject, options)
          break
        case 1:
          result = method(gameObject, options, args[0])
          break
        case 2:
          result = method(gameObject, options, args[0], args[1])
          break
        case 3:
          result = method(gameObject, options, args[0], args[1], args[2])
          break
        default:
          result = method.apply(NULL, [gameObject, options, ...args])
          break
      }
    }

    return result
  },

  processAll (methodName, ...args) {
    const list = this._behaviorList
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; ++i) {
      this.process(list[i].options.$key, methodName, ...args)
    }
  }

}

module.exports = BehaviorContainer
