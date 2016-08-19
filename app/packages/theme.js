const notification = require('../lib/notification')
const Package = require('./package')
const jetpack = require('fs-jetpack')
const path = require('path')

class Theme extends Package {
  constructor (url) {
    super(url)
    this.loaded = false
  }

  update () {
    return super.update().catch((error) => {
      notification.push({
        title: 'Theme update failed',
        message: error.message,
      })
    })
  }

  load () {
    return super.load().then((plugin) => {
      this.logger.log('info', 'loading css for theme')
      this.css = plugin.css = jetpack.read(path.join(this.path, plugin.stylesheet))
      return plugin
    }).catch((errorMessage) => {
      notification.push({
        title: 'Theme install failed',
        message: errorMessage,
      })
    })
  }
}

module.exports = Theme
