const path = require('path')
const electron = require('electron')

const ExternalBlock = require('../externalBlock')

class ServiceScript extends ExternalBlock {
  constructor (data, options) {
    super(data, options)
    this.cwd = data.cwd
    this.options = options
    this.type = data.type
    this.connections = []
    this.interval = parseInt(data.interval, 10)
    if (isNaN(this.interval) || this.interval < 100) {
      this.interval = 100
    }
    try {
      const plugin = electron.remote.require(path.join(this.cwd, data.script))

      this.script = plugin({
        console: this.logger,
        cwd: this.cwd,
      })
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  start () {
    return this.handle()
  }

  handle () {
    if (!this.script) {
      this.logger.error('Plugin failed to load', this.loadError)
      return Promise.resolve()
    }
    return this._ensurePromise(this.script(this.options))
      .then(() => new Promise((resolve) => {
        setTimeout(resolve, this.interval)
      }))
      .then(() => this.start())
      .catch((error) => {
        this.logger.error('Script failed', error)
      })
  }
}

module.exports = ServiceScript
