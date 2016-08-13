const cuid = require('cuid')

const PluginLogger = require('../lib/pluginLogger')

class Block {
  constructor (data) {
    this.pluginId = data.pluginId
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = data.connections || []
    this.logger = new PluginLogger(this.pluginId, this.id)
  }

  call (state) {
    return state.next()
  }
}

module.exports = Block
