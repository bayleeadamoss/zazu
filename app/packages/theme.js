const notification = require('../lib/notification')
const Package = require('./package')
const jetpack = require('fs-jetpack')
const path = require('path')

class Theme extends Package {
  constructor (url) {
    super(url)
    this.loaded = false
  }

  load () {
    return super.load().then((plugin) => {
      this.css = plugin.css = jetpack.read(path.join(this.path, plugin.stylesheet))
      return plugin
    }).catch((errorMessage) => {
      notification.push({
        title: 'Theme failed',
        message: errorMessage,
      })
    })
  }
}

module.exports = Theme
