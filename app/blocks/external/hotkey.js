const EventEmitter = require('events')
const cuid = require('cuid')

const globalEmitter = require('../../lib/globalEmitter')

class Hotkey extends EventEmitter {
  constructor (data, options) {
    super()
    this.type = data.type
    this.id = data.id || cuid()
    this.name = data.name
    this.connections = data.connections || []
    this.hotkey = options[this.name] ? options[this.name] : data.hotkey

    globalEmitter.emit('registerHotkey', this.hotkey)
    globalEmitter.on('triggerHotkey', (accelerator) => {
      if (this.hotkey === accelerator) {
        this.handle()
      }
    })
  }

  call () {}

  handle () {
    this.emit('actioned')
  }
}

module.exports = Hotkey
