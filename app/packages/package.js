const path = require('path')
const jetpack = require('fs-jetpack')

const { clone, pull } = require('../lib/download')
const freshRequire = require('../lib/freshRequire')
const configuration = require('../lib/configuration')
const logger = require('../lib/logger')

class Package {
  constructor (url) {
    this.path = path.join(configuration.pluginDir, url)
    this.url = url
    this.clone = clone
    this.pull = pull
    this.logger = logger.bindMeta({ plugin: this.url })
  }

  load () {
    return this.download().then(() => {
      this.logger.log('verbose', 'loading package')
      const plugin = freshRequire(path.join(this.path, 'zazu.js'))
      plugin.blocks = plugin.blocks || {}
      plugin.blocks.external = plugin.blocks.external || []
      plugin.blocks.input = plugin.blocks.input || []
      plugin.blocks.output = plugin.blocks.output || []
      return plugin
    })
  }

  update () {
    if (!jetpack.exists(this.path)) {
      return Promise.reject('Package' + this.url + ' does not exist')
    }
    this.logger.log('info', 'pull package')
    return this.pull(this.url, this.path)
  }

  download () {
    if (jetpack.exists(this.path)) {
      return Promise.resolve('exists')
    }
    this.logger.log('verbose', 'cloning package')
    return this.clone(this.url, this.path).then(() => {
      return 'downloaded'
    })
  }
}

module.exports = Package
