const globalEmitter = require('../../lib/globalEmitter')
const ExternalBlock = require('../externalBlock')
const Process = require('../../lib/process')

class ServiceScript extends ExternalBlock {
  constructor (data, options) {
    super(data, options)
    this.cwd = data.cwd
    this.options = options
    this.type = data.type
    this.connections = []

    this.script = data.script
    this.interval = parseInt(data.interval, 10)
    if (isNaN(this.interval) || this.interval < 100) {
      this.interval = 100
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
    this.logger.log('Executing Script', { script: this.script })
    return Process.execute(this.script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, this.options),
    }).then((results) => {
      this.queue()
    }).catch((error) => {
      this.logger.error('Script failed', { script: this.script, error })
    })
  }
}

module.exports = ServiceScript
