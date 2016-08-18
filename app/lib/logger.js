const RotateTransport = require('winston-daily-rotate-file')
const winston = require('winston')
const jetpack = require('fs-jetpack')

const configuration = require('./configuration')
const PluginTransport = require('./pluginTransport')
const env = require('./env')

jetpack.dir(configuration.logDir)

const transports = [
  new RotateTransport({
    filename: 'zazu.log',
    dirname: configuration.logDir,
    maxFiles: 3,
  }),
]

if (env.isRenderer) {
  transports.push(new PluginTransport({}))
}

const logger = new winston.Logger({
  level: 'debug',
  exitOnError: false,
  transports,
})

logger.bindMeta = (data) => {
  return {
    log: (type, message, options) => {
      const mergedOptions = Object.assign({}, options, data)
      logger.log(type, message, mergedOptions)
    },
  }
}

module.exports = logger
