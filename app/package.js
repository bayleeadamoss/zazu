const { clone, pull } = require('./lib/git')
const path = require('path')
const jetpack = require('fs-jetpack')
const freshRequire = require('./lib/freshRequire')

const configuration = require('./configuration')

class Package {
  constructor (url) {
    this.path = path.join(configuration.pluginDir, url)
    this.url = url
    this.clone = clone
    this.pull = pull
  }

  load () {
    return this.download().then(() => {
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
    return this.pull(this.path)
  }

  download () {
    if (jetpack.exists(this.path)) {
      return Promise.resolve('exists')
    }
    return this.clone(this.url, this.path).then(() => {
      return 'downloaded'
    })
  }
}

module.exports = Package
