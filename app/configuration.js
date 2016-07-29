const jetpack = require('fs-jetpack')
const path = require('path')

class Configuration {
  constructor () {
    this.profilePath = path.join(require('os').homedir(), '.zazurc.js')
    this.pluginDir = path.join(require('os').homedir(), '.zazu/plugins/')
    this.plugins = []
    this.loaded = false
    this.disableAnalytics = false
    this.theme = ''
    this.hotkey = ''
  }

  load () {
    if (this.loaded) return

    if (!jetpack.exists(this.profilePath)) {
      const template = require('./templates/zazurc')()
      jetpack.write(this.profilePath, template)
    }

    const data = require(this.profilePath)
    this.plugins = data.plugins
    this.theme = data.theme
    this.hotkey = data.hotkey
    this.disableAnalytics = data.disableAnalytics
    this.loaded = true
  }
}

const configuration = new Configuration()

module.exports = configuration
