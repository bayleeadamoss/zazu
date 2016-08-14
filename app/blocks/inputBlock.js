const Block = require('./block')

const globalEmitter = require('../lib/globalEmitter')

class InputBlock extends Block {
  constructor (data) {
    super(data)
    this.pluginId = data.pluginId
    this.isScoped = false
  }

  isActive () {
    return this.isScoped !== false
  }

  setScoped (value) {
    this.isScoped = value
  }

  call (state) {
    setImmediate(() => {
      globalEmitter.emit('showWindow', this.pluginId, this.id)
    })
    return Promise.resolve()
  }

}

module.exports = InputBlock
