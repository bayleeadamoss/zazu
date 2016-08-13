const configuration = require('../lib/configuration')
const noop = require('./track/noop')
const newrelic = require('./track/newrelic')
const env = require('./env.js')

configuration.load()

const disabledAnalytics = configuration.disableAnalytics
const isTesting = env.name === 'test'

module.exports = (isTesting || disabledAnalytics) ? noop : newrelic
