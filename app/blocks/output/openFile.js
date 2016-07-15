const { shell } = require('electron')

const Block = require('../block')

class OpenFile extends Block {
  constructor (data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    shell.openItem(state.value)
    state.next()
  }
}

module.exports = OpenFile
