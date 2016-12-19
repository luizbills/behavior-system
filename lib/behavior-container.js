var NULL // never use "null"
var extend = require('./helper/extend')
var Recycler = require('./helper/recycler')

function BehaviorContainer (gameObject) {
  this._constructor(gameObject)
}

BehaviorContainer.prototype = {

  _constructor: function (gameObject) {
    this.gameObject = gameObject
    this._behaviorList = new Recycler() // store instances
    this._behaviorMap = {} // store indexes
    return this
  },

  set: function (key, behavior, options) {
    if (this.has(key)) throw new Error('"' + key + '" already in use')
    else if (behavior === NULL) throw new Error('invalid behavior')

    var ref = Object.create(behavior)
    var defaults = extend({}, behavior.options)

    ref.options = extend(defaults, options)
    ref.options.$key = key

    this._behaviorMap[key] = this._behaviorList.getNextIndex()
    this._behaviorList.push(ref)

    if (ref.create !== NULL) ref.create(this.gameObject, ref.options)

    return ref
  },

  remove: function (key) {
    var index = this._behaviorMap[key]
    if (index >= 0) {
      var ref = this._behaviorList.iterable[index]
      if (ref.destroy !== NULL) ref.destroy(this.gameObject, ref.options)
      this._behaviorMap[key] = NULL
      this._behaviorList.remove(index)
    }
  },

  has: function (key) {
    return this._behaviorMap[key] !== NULL
  },

  get: function (key) {
    var index = this._behaviorMap[key]
    return index >= 0 ? this._behaviorList.iterable[index] : NULL
  },

  process: function (methodName) {
    var i = 0
    var list = this._behaviorList.iterable
    var len = list.length
    for (; i < len; i++) {
      var ref = list[i]
      if (ref !== NULL && typeof ref[methodName] === 'function') {
        ref[methodName](this.gameObject, ref.options)
      }
    }
    return this
  }

}

module.exports = BehaviorContainer
