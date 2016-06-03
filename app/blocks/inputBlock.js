const Block = require('./block')

const globalEmitter = require('../lib/globalEmitter')

class InputBlock extends Block {
  constructor (data) {
    super(data)
    this.pluginId = data.pluginId
    this.activeState = true
    this.isScoped = false
    globalEmitter.on('showWindow', (pluginId, blockId) => {
      this.activeState = !blockId || this.id === blockId
      this.isScoped = this.id === blockId
    })
  }

  call (state) {
    setImmediate(() => {
      globalEmitter.emit('showWindow', this.pluginId, this.id)
    })
  }

  active () {
    return this.activeState
  }

}

module.exports = InputBlock
