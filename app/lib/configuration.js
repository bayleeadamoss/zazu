const jetpack = require('fs-jetpack')
const path = require('path')

class Configuration {
  constructor () {
    const cwd = process.cwd()
    const portableHome = path.join(cwd, 'portable')
    if (require('fs').existsSync(portableHome)) {
      process.env.ZAZU_HOME = portableHome
    }

    const home = process.env.ZAZU_HOME || require('os').homedir()
    this.profilePath = path.join(home, '.zazurc.json')
    this.pluginDir = path.join(home, '.zazu/plugins/')
    this.databaseDir = path.join(home, '.zazu/databases')
    this.logDir = path.join(home, '.zazu/log')
    this.plugins = []
    this.loaded = false
    this.disableAnalytics = false
    this.theme = ''
    this.hotkey = ''
    this.debug = false
    this.height = 700
  }

  load () {
    if (this.loaded) return

    if (!jetpack.exists(this.profilePath)) {
      const template = require('../templates/zazurc.json')
      jetpack.write(this.profilePath, template)
    }

    try {
      const data = require(this.profilePath)
      this.plugins = data.plugins
      this.theme = data.theme
      this.hotkey = data.hotkey
      this.displayOn = data.displayOn !== 'primary' ? 'detect' : 'primary'
      this.disableAnalytics = data.disableAnalytics
      this.debug = data.debug
      this.loaded = true
      this.height = 700
    } catch (e) {
      const logger = require('./logger')
      logger.error('Attempted to load an invalid ~/.zazurc.json file', e)
    }

    return this.loaded
  }
}

const configuration = new Configuration()

module.exports = configuration
