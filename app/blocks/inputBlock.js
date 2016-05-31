const Block = require('./block')

const globalEmitter = require('../lib/globalEmitter')

class InputBlock extends Block {
  constructor (data) {
    super(data)
    this.activeState = true
    globalEmitter.on('showWindow', (pluginId, blockId) => {
      this.activeState = !blockId || this.id === blockId
    })
  }

  call (state) {
    const message = require('electron').ipcRenderer
    message.send('message', 'CANNOT CALL call() on an inputblock!... yet!')
  }

  active () {
    return this.activeState
  }
}

module.exports = InputBlock
