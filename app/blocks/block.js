const cuid = require('cuid')

const logger = require('../lib/logger')

class Block {
  constructor (data) {
    this.pluginId = data.pluginId
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = data.connections || []
    this.logger = logger.bindMeta({ plugin: this.pluginId, block: this.id })
  }

  call (state) {
    return state.next()
  }
}

module.exports = Block
