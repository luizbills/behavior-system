const NULL = undefined; // never use "null"
const BehaviorContainer = require('./behavior-container')
const removeByIndex = require('./helper/remove-by-index')

function BehaviorSystem () {
  this._children = []
}

BehaviorSystem.prototype = {

  constructor: BehaviorSystem,

  enable (entity) {
    if (entity.behaviors === NULL) {
      entity.behaviors = new BehaviorContainer(entity, this)
      entity.behaviors.ID = this._children.push(entity.behaviors) - 1
      return true
    }
    return false
  },

  disable (entity) {
    if (entity.behaviors !== NULL && entity.behaviors.system === this) {
      entity.behaviors.removeAll()
      removeByIndex(this._children, entity.behaviors.ID)
      entity.behaviors = NULL
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
