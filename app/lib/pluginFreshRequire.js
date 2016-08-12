const path = require('path')

module.exports = (pluginPath) => {
  const pluginName = path.basename(pluginPath)
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(pluginName) !== -1) {
      delete require.cache[file]
    }
  })
}
