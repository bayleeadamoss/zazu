const jetpack = require('fs-jetpack')
const path = require('path')
const fs = require('fs')

class Configuration {
  constructor () {
    this.profilePath = path.join(require('os').homedir(), '.zazurc.js')
    this.pluginDir = path.join(require('os').homedir(), '.zazu/plugins/')
    this.plugins = []
    this.theme = ''
    this.hotkey = ''
  }

  load () {
    return new Promise((resolve, reject) => {
      if (!jetpack.exists(this.profilePath)) {
        const template = require('./templates/zazurc')()
        fs.writeFileSync(this.profilePath, template)
      }

      const data = require(this.profilePath)
      this.plugins = data.plugins
      this.theme = data.theme
      this.hotkey = data.hotkey
      resolve()
    })
  }
}

const configuration = new Configuration()

module.exports = configuration
