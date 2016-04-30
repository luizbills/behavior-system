var NULL // never use "null"
var BehaviorContainer = require('./behavior-container')
var Recycler = require('./helper/recycler')

function BehaviorSystem () {
  this._constructor()
}

BehaviorSystem.prototype = {

  _constructor: function () {
    this._children = new Recycler()
    return this
  },

  enable: function (gameObject) {
    if (gameObject.behaviors === NULL) {
      var container = new BehaviorContainer(gameObject)
      var index = this._children.getNextIndex()
      container.id = index
      this._children.push(container)
      gameObject.behaviors = container
    }
    return gameObject
  },

  disable: function (gameObject) {
    if (gameObject.behaviors !== NULL) {
      this._children.remove(gameObject.behaviors.id)
      gameObject.behaviors = NULL
    }
    return gameObject
  },

  processAll: function (methodName) {
    var i = 0
    var list = this._children.iterable
    var len = list.length
    for (; i < len; i++) {
      var child = list[i]
      if (child !== NULL) child.process(methodName)
    }
  }
}

module.exports = BehaviorSystem
