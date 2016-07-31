module.exports = (path) => {
  delete require.cache[path]
  return require(path)
}
