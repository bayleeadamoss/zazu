const globalEmitter = require('./globalEmitter')
const util = require('util')
const winston = require('winston')

var PluginLogger = (winston.transports.PluginLogger = function (options) {
  this.name = 'pluginLogger'
  this.level = options.level || 'verbose'
  this.devtoolOpened = false
  globalEmitter.on('debuggerOpened', () => {
    this.devtoolOpened = true
  })
  globalEmitter.on('debuggerClosed', () => {
    this.devtoolOpened = false
  })
})

util.inherits(PluginLogger, winston.Transport)

PluginLogger.prototype.log = function (level, message, meta, callback) {
  if (this.devtoolOpened === true && meta.plugin) {
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
