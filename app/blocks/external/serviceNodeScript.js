const path = require('path')

const ServiceScript = require('./serviceScript')

class ServiceNodeScript extends ServiceScript {
  constructor (data) {
    super(data)
    try {
      const plugin = require(path.join(this.cwd, this.script))
      this.script = plugin({
        console: this.logger,
        cwd: this.cwd,
      })
    } catch (e) {
      this.script = false
      this.loadError = e
    }
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

module.exports = ServiceNodeScript
