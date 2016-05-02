import jetpack from 'fs-jetpack'
import path from 'path'

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
        jetpack.copy('./templates/zazurc.js', this.profilePath, {
          overwrite: false,
        })
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

export default configuration
