const git = require('nodegit')
const path = require('path')
const jetpack = require('fs-jetpack')

const configuration = require('./configuration')

class Package {
  constructor (url) {
    this.path = path.join(configuration.pluginDir, url)
    this.url = url
    this.clone = git.Clone
  }

  load () {
    return this.download().then(() => {
      const plugin = require(path.join(this.path, 'zazu.js'))
      plugin.blocks = plugin.blocks || {}
      plugin.blocks.external = plugin.blocks.external || []
      plugin.blocks.input = plugin.blocks.input || []
      plugin.blocks.output = plugin.blocks.output || []
      return plugin
    })
  }

  download () {
    if (jetpack.exists(this.path)) {
      return Promise.resolve('exists')
    }
    return this.clone('https://github.com/' + this.url, this.path).then(() => {
      return 'downloaded'
    })
  }
}

module.exports = Package
