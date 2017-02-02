const globalEmitter = require('../../lib/globalEmitter')
const Block = require('../block')

class ReloadConfig extends Block {
  constructor (data) {
    super(data)
    this.url = data.url || '{value}'
  }

  call () {
    this.logger.log('info', 'Reloading configuration')
    globalEmitter.emit('reloadConfig')
    return Promise.resolve()
  }
}

module.exports = ReloadConfig
