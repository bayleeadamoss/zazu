const EventEmitter = require('events')
const cuid = require('cuid')

const globalEmitter = require('../lib/globalEmitter')

class ExternalBlock extends EventEmitter {
  constructor (data, options) {
    super()
    this.pluginId = data.pluginId
    this.id = data.id || cuid()
  }

  log (message, data) {
    globalEmitter.emit('pluginLog', {
      type: 'log',
      pluginId: this.pluginId,
      blockId: this.id,
      message,
      data,
    })
  }

  warn (message, data) {
    globalEmitter.emit('pluginLog', {
      type: 'warn',
      pluginId: this.pluginId,
      blockId: this.id,
      message,
      data,
    })
  }

  error (message, data) {
    globalEmitter.emit('pluginLog', {
      type: 'error',
      pluginId: this.pluginId,
      blockId: this.id,
      message,
      data,
    })
  }
}

module.exports = ExternalBlock
