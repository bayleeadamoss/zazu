module.exports = (pluginContext) => {
  return (value) => {
    return new Promise((resolve, reject) => {
      resolve('GMO ' + value)
    })
  }
}
