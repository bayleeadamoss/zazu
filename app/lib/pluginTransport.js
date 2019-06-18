const Transport = require('winston-transport')
const globalEmitter = require('./globalEmitter')

class PluginLogger extends Transport {
  constructor (options) {
    super(options)
    this.name = 'pluginLogger'
    this.level = options.level || 'verbose'
    this.devtoolOpened = false
    this.mainWindowOpened = false
    globalEmitter.on('debuggerOpened', () => {
      this.devtoolOpened = true
    })
    globalEmitter.on('debuggerClosed', () => {
      this.devtoolOpened = false
    })
    globalEmitter.on('showWindow', () => {
      this.mainWindowOpened = true
    })
    globalEmitter.on('hideWindow', () => {
      this.mainWindowOpened = false
    })
  }

  log (level, message, meta, callback) {
    // only log plugin error when normal user won't be affected
    if ((this.devtoolOpened === true || this.mainWindowOpened === false) && meta.plugin) {
      globalEmitter.emit('pluginLog', {
        level,
        message,
        ...meta,
      })
    }
    callback(null, true)
  }
}

module.exports = PluginLogger
