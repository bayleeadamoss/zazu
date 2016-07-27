const globalEmitter = require('../../lib/globalEmitter')
const ExternalBlock = require('../externalBlock')

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
      const plugin = require(path.join(this.cwd, data.script))
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
    this.queue()
  }

  call () {}

  queue () {
    this.logger.log('Queueing Service', { interval: this.interval })
    setTimeout(() => {
      const promise = this.handle()
      const killPromise = () => {
        this.logger.warn('Killing service')
        promise.cancel()
      }
      globalEmitter.on('quitApp', killPromise)
      promise.then(() => {
        globalEmitter.removeListener('quitApp', killPromise)
      })
    }, this.interval)
  }

  handle () {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return Promise.resolve()
    }
    this.logger.log('Executing script')
    return this.script(this.options).then(() => {
      this.queue()
    }).catch((error) => {
      this.logger.error('Script failed', { error })
    })
  }
}

module.exports = ServiceScript
