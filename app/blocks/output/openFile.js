const { shell } = require('electron')
const os = require('os')

const Block = require('../block')

class OpenFile extends Block {
  constructor (data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    const fullPath = state.value.replace(/^~/, os.homedir())
    this.logger.log('info', 'Opening File', { fullPath })
    shell.openItem(fullPath)
    return state.next()
  }
}

module.exports = OpenFile
