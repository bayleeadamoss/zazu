const jetpack = require('fs-jetpack')
const path = require('path')

class Configuration {
  constructor () {
    const home = process.env.ZAZU_HOME || require('os').homedir()
    this.profilePath = path.join(home, '.zazurc.js')
    this.pluginDir = path.join(home, '.zazu/plugins/')
    this.databaseDir = path.join(home, '.zazu/databases')
    this.logDir = path.join(home, '.zazu/log')
    this.plugins = []
    this.loaded = false
    this.disableAnalytics = false
    this.theme = ''
    this.hotkey = ''
    this.debug = false
  }

  load () {
    if (this.loaded) return

    if (!jetpack.exists(this.profilePath)) {
      const template = require('../templates/zazurc')()
      jetpack.write(this.profilePath, template)
    }

    try {
      const data = require(this.profilePath)
      this.plugins = data.plugins
      this.theme = data.theme
      this.hotkey = data.hotkey
      this.disableAnalytics = data.disableAnalytics
      this.debug = data.debug
      this.loaded = true
    } catch (e) {
      const logger = require('./logger')
      logger.log('error', 'Attempted to load an invalid ~/.zazurc.js file', {
        message: e.message,
        stack: e.stack,
      })
    }

    return this.loaded
  }
}

const configuration = new Configuration()

module.exports = configuration
