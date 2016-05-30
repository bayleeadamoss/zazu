const cuid = require('cuid')

class Block {
  constructor (data) {
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = data.connections || []
  }

  call (state) {
    state.next()
  }
}

module.exports = Block
