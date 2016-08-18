const { shell } = require('electron')
const os = require('os')

const Block = require('../block')

class ShowFile extends Block {
  constructor (data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    const fullPath = state.value.replace(/^~/, os.homedir())
    this.logger.log('info', 'Showing File', { fullPath })
    shell.showItemInFolder(fullPath)
    return state.next()
  }
}

module.exports = ShowFile
