const EventEmitter = require('events')
const cuid = require('cuid')

const globalEmitter = require('../../lib/globalEmitter')

class Hotkey extends EventEmitter {
  constructor (data) {
    super()
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = data.connections || []
    this.hotkey = data.hotkey

    globalEmitter.emit('registerHotkey', this.hotkey)
    globalEmitter.on('triggerHotkey', (accelerator) => {
      if (this.hotkey === accelerator) {
        this.handle()
      }
    })
  }

  handle () {
    this.emit('actioned')
  }
}

module.exports = Hotkey
