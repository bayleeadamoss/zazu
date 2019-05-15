const path = require('path')
const jetpack = require('fs-jetpack')

const { clone, pull } = require('../lib/download')
const configuration = require('../lib/configuration')
const logger = require('../lib/logger')
const notification = require('../lib/notification')
const retry = require('../lib/retry')

class Package {
  constructor (url) {
    this.path = path.join(configuration.pluginDir, url)
    this.url = url
    this.clone = clone
    this.pull = pull
    this.logger = logger.bindMeta({ plugin: this.url })
  }

  load = () => {
    return this.download()
      .then(this.check)
      .then(async () => {
        this.logger.log('verbose', 'loading package: ' + this.url)
        try {
          const plugin = await jetpack.readAsync(path.join(this.path, 'zazu.json'), 'json')
          this.logger.log('verbose', 'loaded package zazu.json: ' + this.url, plugin)
          plugin.blocks = plugin.blocks || {}
          plugin.blocks.external = plugin.blocks.external || []
          plugin.blocks.input = plugin.blocks.input || []
          plugin.blocks.output = plugin.blocks.output || []
          return plugin
        } catch (e) {
          this.logger.error(`failed to load "${this.url}" configuration`, e)
          notification.push({
            title: 'Configuration failed to load',
            message: `There was a syntax error in configuration for "${this.url}"`,
          })
        }
      })
  }

  /** sometimes git is slow, so we wait a second before reading zazu.json */
  check = () => {
    return retry(
      `checking zazu.json in [${path.join(this.path, 'zazu.json')}]`,
      () =>
        new Promise((resolve, reject) =>
          setTimeout(
            () =>
              jetpack
                .existsAsync(path.join(this.path, 'zazu.json'))
                .then(result =>
                  result === 'file' ? resolve() : reject(new Error(`result of jetpack.existsAsync is ${result}`))
                ),
            500
          )
        )
    )
  }

  update () {
    if (!jetpack.exists(this.path)) {
      return Promise.reject(new Error('Package' + this.url + ' does not exist'))
    }
    this.logger.log('info', 'pull package')
    return this.pull(this.url, this.path)
  }

  download () {
    return this.clone(this.url, this.path)
  }
}

module.exports = Package
