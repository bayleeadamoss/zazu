const { shell } = require('electron')

const Block = require('../block')

class ShowFile extends Block {
  constructor (data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    shell.showItemInFolder(state.value)
    state.next()
  }
}

module.exports = ShowFile
