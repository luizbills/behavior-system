var NULL = require('./helper/null').NULL
var BehaviorContainer = require('./behavior-container').BehaviorContainer

function BehaviorSystem () {
  this._init()
}

BehaviorSystem.prototype = {

  _init: function () {
    this._children = []
  },

  enable: function (gameObject) {
    if (!gameObject.behaviors) {
      var container = new BehaviorContainer(gameObject, this)
      var id = this._children.push(container) - 1

      container.id = id
      gameObject.behaviors = container
    }
    return gameObject
  },

  disable: function (gameObject) {
    var index = gameObject.behaviors && gameObject.behaviors.id
    if (index) {
      gameObject.behaviors = NULL
      this._children[index] = NULL
    }
    return gameObject
  },

  processAll: function (methodName) {
    var i = 0
    var len = this._children.length

    for (; i < len; i++) {
      this._children[i].process(methodName)
    }
  }
}

module.exports = {
  BehaviorSystem: BehaviorSystem
}
