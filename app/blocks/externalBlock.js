const EventEmitter = require('events')
const cuid = require('cuid')

const logger = require('../lib/logger')

class ExternalBlock extends EventEmitter {
  constructor (data, options) {
    super()
    this.pluginId = data.pluginId
    this.id = data.id || cuid()
    this.logger = logger.bindMeta({ plugin: this.url, block: this.id })
  }

  call () {
    return Promise.resolve()
  }
}

module.exports = ExternalBlock
