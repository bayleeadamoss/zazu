const EventEmitter = require('events')
const cuid = require('cuid')

const logger = require('../lib/logger')

class ExternalBlock extends EventEmitter {
  constructor (data, options) {
    super()
    this.pluginId = data.pluginId
    this.id = data.id || cuid()
    this.logger = logger.bindMeta({ plugin: data.pluginId, block: this.id })
  }

  _ensurePromise (val) {
    if (!(val instanceof Promise)) {
      this.logger.log('error', 'Block did not return a Promise')
      return Promise.resolve()
    }
    return val
  }

  call () {
    return Promise.resolve()
  }
}

module.exports = ExternalBlock
