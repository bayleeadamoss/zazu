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

  requiredField (fieldName) {
    const blockName = this.constructor.name
    this.logger.log('error', `Field "${fieldName}" is required.`, {
      fieldName,
      blockName,
    })
  }

  _ensurePromise (val) {
    if (!(val instanceof Promise)) {
      this.logger.log('error', 'Block did not return a Promise')
      return Promise.resolve()
    }
    return val
  }

  call (state) {
    return state.next()
  }
}

module.exports = Block
