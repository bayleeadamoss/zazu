const React = require('react')
const PropTypes = require('prop-types')

const configuration = require('../lib/configuration')
const logger = require('../lib/logger')

class ConfigWrapper extends React.Component {
  getChildContext = () => {
    configuration.load()
    return {
      configuration,
      logger,
    }
  }

  render () {
    return this.props.children
  }
}

ConfigWrapper.propTypes = {
  children: PropTypes.node,
}

ConfigWrapper.childContextTypes = {
  configuration: PropTypes.object,
  logger: PropTypes.object,
}

module.exports = ConfigWrapper
