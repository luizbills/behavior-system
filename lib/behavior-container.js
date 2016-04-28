var NULL = require('./helper/null').NULL
var extend = require('./helper/extend').extend

function BehaviorContainer (gameObject, parent) {
  return this._init(gameObject, parent)
}

BehaviorContainer.prototype = {

  _init: function (gameObject, parent) {
    this.gameObject = gameObject
    this.parent = parent
    this._behaviorRef = []
    this._behaviorMap = {}
    return this
  },

  set: function (key, behavior, options) {
    if (this.has(key)) return

    var ref = Object.create(behavior)
    var defaults = extend({}, behavior.options)
    var index

    ref.options = extend(defaults, options)
    ref.options.$key = key

    index = this._behaviorRef.push(ref) - 1
    ref.options.$index = index

    this._behaviorMap[key] = index

    if (ref.create) ref.create(this.gameObject, ref.options)

    return behavior
  },

  get: function (key) {
    var index = this._behaviorMap[key]
    return index >= 0 ? this._behaviorRef[index] : NULL
  },

  has: function (key) {
    return this._behaviorMap[key] !== NULL
  },

  remove: function (key) {
    var index = this._behaviorMap[key]
    if (index >= 0) {
      this._behaviorMap[key] = NULL
      this._behaviorRef[index] = NULL
    }
  },

  process: function (methodName) {
    var i = 0
    var len = this._behaviorRef.length

    for (; i < len; i++) {
      var ref = this._behaviorRef[i]
      if (ref && typeof ref[methodName] === 'function') {
        ref[methodName](this.gameObject, ref.options)
      }
    }
  }
}

module.exports = {
  BehaviorContainer: BehaviorContainer
}
