const NULL = undefined; // never use "null"
const BehaviorContainer = require('./behavior-container')
const removeByIndex = require('./helper/remove-by-index')

function BehaviorSystem () {
  this._children = []
}

BehaviorSystem.prototype = {

  constructor: BehaviorSystem,

  enable (gameObject) {
    if (gameObject.behaviors === NULL) {
      gameObject.behaviors = new BehaviorContainer(gameObject, this)
      gameObject.behaviors.index = this._children.push(gameObject.behaviors) - 1
      return true
    }
    return false
  },

  disable (gameObject) {
    if (gameObject.behaviors !== NULL && gameObject.behaviors.parent === this) {
      gameObject.behaviors.removeAll()
      removeByIndex(this._children, gameObject.behaviors.index)
      gameObject.behaviors = NULL
      return true
    }
    return false
  },

  globalProcessAll (methodName, ...args) {
    const list = this._children
    const len = list.length

    if (len === 0) return

    for (let i = 0; i < len; i++) {
      list[i].processAll(methodName, ...args)
    }
  }
}

module.exports = BehaviorSystem
