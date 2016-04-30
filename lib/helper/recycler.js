var NULL // never use "null"

/*
 * Used to track avaliable empry spaces in an array
*/
function Recycler (arr) {
  this._constructor(arr)
}

Recycler.prototype = {

  _constructor: function (arr) {
    this.iterable = Array.isArray(arr) ? arr.slice() : []
    this._recycledIndexes = []
    return this
  },

  push: function (value) {
    if (value === NULL) return new TypeError('undefined value')
    this._set(value)
    return this.iterable.length
  },

  remove: function (index) {
    if (index === NULL || index >= this.iterable.length || index < 0) throw new Error('invalid index')
    var value

    if (index === (this.iterable.length - 1)) {
      value = this.pop()
    } else {
      value = this.iterable[index]
      this.iterable[index] = NULL
      this._recycleIndex(index)
    }

    return value
  },

  pop: function () {
    return this.iterable.pop()
  },

  getNextIndex: function () {
    var recycled = this._recycledIndexes
    var len = recycled.length
    return len > 0 ? recycled[len - 1] : this.iterable.length
  },

  _set: function (value) {
    var index = this._recycledIndexes.pop()
    if (index === NULL) index = this.iterable.length
    this.iterable[index] = value
  },

  _recycleIndex: function (index) {
    this._recycledIndexes.push(index)
  }
}

module.exports = Recycler
