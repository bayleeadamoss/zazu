const clone = require('git-clone')
const path = require('path')
const jetpack = require('fs-jetpack')
const Process = require('./lib/process')

const configuration = require('./configuration')

class Package {
  constructor (url) {
    this.path = path.join(configuration.pluginDir, url)
    this.url = url
    this.clone = clone
  }

  load () {
    return this.download().then(() => {
      return require(path.join(this.path, 'zazu.js'))
    })
  }

  download () {
    return new Promise((resolve, reject) => {
      if (jetpack.exists(this.path)) {
        return resolve()
      }
      this.clone('https://github.com/' + this.url, this.path, { shallow: true }, (error) => {
        if (error) {
          reject(`Package '${this.url}' failed to load.`)
        } else {
          const plugin = require(path.join(this.path, 'zazu.js'))
          Process.execute(plugin.install, {
            cwd: this.path,
          }).then(() => {
            resolve()
          })
        }
      })
    })
  }
}

module.exports = Package
