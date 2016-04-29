import jetpack from 'fs-jetpack'
import path from 'path'

class Configuration {
  constructor () {
    this.profilePath = path.join(require('os').homedir(), '.zazurc.js')
    this.pluginDir = path.join(require('os').homedir(), '.zazu/plugins/')
    this.plugins = []
    this.theme = ''
    this.hotkey = ''
    this.reload()
  }

  reload () {
    if (!jetpack.exists(this.profilePath)) {
      jetpack.copy('./templates/zazurc.js', this.profilePath, {
        overwrite: false,
      })
    }

    const data = require(this.profilePath)
    this.plugins = data.plugins
    this.theme = data.theme
    this.hotkey = data.hotkey
  }
}

const configuration = new Configuration()

export default configuration
