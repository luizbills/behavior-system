function extend (dest, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key]
    }
  }
  return dest
}

module.exports = extend
