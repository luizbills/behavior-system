const BehaviorContainer = require('./behavior-container')
const removeByIndex = require('./helper/remove-by-index')

module.exports = class BehaviorSystem {
  constructor () {
    this._children = []
    this._indexesMap = {}
    this._nextID = 1
    this._recycledIDs = []
  }

  enable (entity) {
    if (typeof entity.behaviors !== 'object') {
      entity.behaviors = new BehaviorContainer(entity, this, this._generateID())

      // store the container id and array index (inside of this._children)
      this._indexesMap[entity.behaviors.getID()] = this._children.push(entity.behaviors) - 1

      return true
    }
    return false
  }

  disable (entity) {
    if (entity.behaviors && entity.behaviors.system === this) {
      const index = this._indexesMap[entity.behaviors.getID()]
      const len = this._children.length
      const lastChild = this._children[len - 1]

      if (len !== 1 && (index + 1) !== len) {
        // update the last container array index (inside of this._children)
        this._indexesMap[lastChild.getID()] = index
      }

      entity.behaviors.removeAll()
      removeByIndex(this._children, index)

      // recycle the container ID
      this._recycledIDs.push(entity.behaviors.getID())
      delete entity.behaviors

      return true
    }
    return false
  }

  globalProcessAll (methodName, ...args) {
    const children = this._children

    for (let i = 0; i < children.length; i++) {
      children[i].processAll(methodName, ...args)
    }
  }

  _generateID () {
    if (this._recycledIDs.length > 0) {
      // return a recycled id
      return this._recycledIDs.pop()
    }
    return this._nextID++
  }
}
