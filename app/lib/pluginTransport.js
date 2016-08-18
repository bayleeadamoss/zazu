const globalEmitter = require('./globalEmitter')
const util = require('util')
const winston = require('winston')

var PluginLogger = winston.transports.PluginLogger = function (options) {
  this.name = 'pluginLogger'
  this.level = options.level || 'verbose'
}

util.inherits(PluginLogger, winston.Transport)

PluginLogger.prototype.log = function (level, message, meta, callback) {
  if (meta.plugin) {
    globalEmitter.emit('pluginLog', Object.assign({}, {
      level,
      message,
    }, meta))
  }
  callback(null, true)
}

module.exports = PluginLogger
