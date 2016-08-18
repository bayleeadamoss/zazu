const React = require('react')

const configuration = require('../lib/configuration')
const logger = require('../lib/logger')

const ConfigWrapper = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
  },

  childContextTypes: {
    configuration: React.PropTypes.object,
    logger: React.PropTypes.object,
  },

  getChildContext () {
    configuration.load()
    return {
      configuration,
      logger,
    }
  },

  render () {
    return this.props.children
  },
})

module.exports = ConfigWrapper
