const globalEmitter = require('./globalEmitter')
const env = require('../env')

class PluginLogger {
  constructor (pluginId, blockId) {
    this.pluginId = pluginId
    this.blockId = blockId
  }

  log (message, data) {
    this._log('log', message, data)
  }

  warn (message, data) {
    this._log('warn', message, data)
  }

  error (message, data) {
    window.newrelic.noticeError(message)
    this._log('error', message, data)
  }

  _log (type, message, data) {
    if (env.name !== 'test') {
      console[type](message, data)
    }
    globalEmitter.emit('pluginLog', {
      type,
      pluginId: this.pluginId,
      blockId: this.blockId,
      message,
      data,
    })
  }
}

module.exports = PluginLogger
