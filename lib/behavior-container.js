var NULL // never use "null"
var extend = require('./helper/extend')

function BehaviorContainer (gameObject) {
  this._constructor(gameObject)
}

BehaviorContainer.prototype = {

  _constructor: function (gameObject) {
    this.gameObject = gameObject
    this._behaviorList = [] // store instances
    this._behaviorMap = {} // store indexes
    return this
  },

  set: function (key, behavior, options) {
    if (this.has(key)) throw new Error('"' + key + '" already in use')

    var ref = Object.create(behavior)
    var defaults = extend({}, behavior.options)
    var index

    ref.options = extend(defaults, options)
    ref.options.$key = key

    index = this._behaviorList.push(ref) - 1

    this._behaviorMap[key] = index

    if (ref.create !== NULL) ref.create(this.gameObject, ref.options)

    return behavior
  },

  get: function (key) {
    var index = this._behaviorMap[key]
    return index >= 0 ? this._behaviorList[index] : NULL
  },

  has: function (key) {
    return this._behaviorMap[key] !== NULL
  },

  remove: function (key) {
    var index = this._behaviorMap[key]
    if (index >= 0) {
      this._behaviorMap[key] = NULL
      this._behaviorList[index] = NULL
    }
  },

  process: function (methodName) {
    var i = 0
    var len = this._behaviorList.length
    for (; i < len; i++) {
      var ref = this._behaviorList[i]
      if (ref && typeof ref[methodName] === 'function') {
        ref[methodName](this.gameObject, ref.options)
      }
    }
  }
}

module.exports = BehaviorContainer
