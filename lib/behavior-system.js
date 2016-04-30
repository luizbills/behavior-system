var NULL // never use "null"
var BehaviorContainer = require('./behavior-container').BehaviorContainer

function BehaviorSystem () {
  this._init()
}

BehaviorSystem.prototype = {

  _init: function () {
    this._children = []
  },

  enable: function (gameObject) {
    if (gameObject.behaviors === NULL) {
      var container = new BehaviorContainer(gameObject)
      container.id = this._children.push(container) - 1
      gameObject.behaviors = container
    }
    return gameObject
  },

  disable: function (gameObject) {
    if (gameObject.behaviors !== NULL) {
      var index = gameObject.behaviors.id
      gameObject.behaviors = NULL
      this._children[index] = NULL
    }
    return gameObject
  },

  processAll: function (methodName) {
    var i = 0
    var len = this._children.length
    for (; i < len; i++) {
      var child = this._children[i]
      if (child !== NULL) {
        child.process(methodName)
      }
    }
  }
}

module.exports = BehaviorSystem
