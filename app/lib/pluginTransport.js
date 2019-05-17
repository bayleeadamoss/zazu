const globalEmitter = require('./globalEmitter')
const util = require('util')
const winston = require('winston')

var PluginLogger = (winston.transports.PluginLogger = function (options) {
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
})

util.inherits(PluginLogger, winston.Transport)

PluginLogger.prototype.log = function (level, message, meta, callback) {
  // only log plugin error when normal user won't be affected
  if ((this.devtoolOpened === true || this.mainWindowOpened === false) && meta.plugin) {
    globalEmitter.emit(
      'pluginLog',
      Object.assign(
        {},
        {
          level,
          message,
        },
        meta
      )
    )
  }
  callback(null, true)
}

module.exports = PluginLogger
