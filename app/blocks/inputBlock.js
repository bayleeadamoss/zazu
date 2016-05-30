const Block = require('./block')

class InputBlock extends Block {
  call (state) {
    require('electron').ipcRenderer.send('message', 'CANNOT CALL call() on an inputblock!... yet!')
  }
}

module.exports = InputBlock
