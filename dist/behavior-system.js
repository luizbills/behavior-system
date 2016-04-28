(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BehaviorSystem = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var NULL = require('./helper/null').NULL
var extend = require('./helper/extend').extend

function BehaviorContainer (gameObject, parent) {
  return this._init(gameObject, parent)
}

BehaviorContainer.prototype = {

  _init: function (gameObject, parent, id) {
    this.gameObject = gameObject
    this.parent = parent
    this.id = id
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

},{"./helper/extend":3,"./helper/null":4}],2:[function(require,module,exports){
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

},{"./behavior-container":1,"./helper/null":4}],3:[function(require,module,exports){
function extend (dest, source) {
  if (source != null) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key]
      }
    }
  }
  return dest
}

module.exports = {
  extend: extend
}

},{}],4:[function(require,module,exports){
// don't use "null"
module.exports = { NULL: void 0 }

},{}]},{},[2])(2)
});