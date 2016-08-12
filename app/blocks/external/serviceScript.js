const ExternalBlock = require('../externalBlock')
const freshRequire = require('../../lib/freshRequire')

const path = require('path')

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
      const plugin = freshRequire(path.join(this.cwd, data.script))
      const electron = require('electron')
      this.script = plugin({
        console: this.logger,
        cwd: this.cwd,
        clipboard: electron.clipboard,
        nativeImage: electron.nativeImage,
      })
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  call () {}

  start () {
    this.logger.info('Queueing Service', { interval: this.interval })
    return new Promise((resolve) => {
      setTimeout(resolve, this.interval)
    }).then(() => {
      return this.handle()
    })
  }

  handle () {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return Promise.resolve()
    }
    this.logger.info('Executing script')
    return this.script(this.options).then(() => {
      this.start()
    }).catch((error) => {
      this.logger.error('Script failed', { error })
    })
  }
}

module.exports = ServiceScript
