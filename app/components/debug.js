const React = require('react')
const globalEmitter = require('../lib/globalEmitter')

const Debug = React.createClass({
  getInitialState () {
    return {
      selectedPlugin: 'Any',
      selectedType: 'warn',
      logTypes: ['info', 'log', 'warn', 'error'],
      plugins: [],
      items: [],
    }
  },

  log (options) {
    const items = Object.assign([], this.state.items)
    const plugins = Object.assign([], this.state.plugins)
    items.unshift(Object.assign({}, options, {
      time: new Date(),
    }))
    if (plugins.indexOf(options.pluginId) === -1) {
      plugins.push(options.pluginId)
    }
    this.setState({
      plugins,
      items,
    })
  },

  componentDidMount () {
    globalEmitter.on('pluginLog', (options) => {
      this.log(options)
    })
  },

  componentWillUnmount () {
    globalEmitter.removeAllListeners('pluginLog')
  },

  handleTypeChange (e) {
    this.setState({
      selectedType: e.target.value,
    })
  },

  handlePluginChange (e) {
    this.setState({
      selectedPlugin: e.target.value,
    })
  },

  allowedTypes () {
    if (this.state.selectedType === 'error') {
      return ['error']
    } else if (this.state.selectedType === 'warn') {
      return ['error', 'warn']
    } else if (this.state.selectedType === 'log') {
      return ['error', 'warn', 'log']
    } else if (this.state.selectedType === 'info') {
      return ['error', 'warn', 'log', 'info']
    }
  },

  render () {
    const allowedTypes = this.allowedTypes()
    return React.createElement(
      'ul',
      null,
      React.createElement(
        'select',
        {
          defaultValue: 'Any',
          onChange: this.handlePluginChange,
        },
        ['Any'].concat(this.state.plugins).map((pluginId) => {
          return React.createElement('option', { key: pluginId }, pluginId)
        })
      ),
      React.createElement(
        'select',
        {
          defaultValue: this.state.selectedType,
          onChange: this.handleTypeChange,
        },
        this.state.logTypes.map((logType) => {
          return React.createElement('option', { key: logType }, logType)
        })
      ),
      React.createElement(
        'ul',
        null,
        this.state.items.filter((item) => {
          return ['Any', item.pluginId].indexOf(this.state.selectedPlugin) !== -1
        }).filter((item) => {
          return allowedTypes.indexOf(item.type) !== -1
        }).slice(0, 100).map((item, key) => {
          return React.createElement(
            'li',
            { key },
            React.createElement(
              'pre',
              { className: item.type },
              item.type.toUpperCase(), ': ',
              '[' + item.time.toTimeString().split(' ')[0] + ']',
              '[' + item.pluginId, ':', item.blockId + '] '
            ),
            React.createElement('pre', null, item.message),
            React.createElement('pre', null, JSON.stringify(item.data, null, 2))
          )
        })
      )
    )
  },
})

module.exports = Debug
