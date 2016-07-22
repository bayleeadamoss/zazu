const EventEmitter = require('events')
const cuid = require('cuid')

const PluginLogger = require('../lib/pluginLogger')

class ExternalBlock extends EventEmitter {
  constructor (data, options) {
    super()
    this.pluginId = data.pluginId
    this.id = data.id || cuid()
    this.logger = new PluginLogger(this.pluginId, this.id)
  }
}

module.exports = ExternalBlock
