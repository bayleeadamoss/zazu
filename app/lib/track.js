const configuration = require('../configuration')
const noop = require('./track/noop')
const newrelic = require('./track/newrelic')

configuration.load()
module.exports = configuration.disableAnalytics ? noop : newrelic
