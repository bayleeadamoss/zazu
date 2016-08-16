const React = require('react')
const globalEmitter = require('../lib/globalEmitter')

const Debug = React.createClass({
  getInitialState () {
    return {
      selectedPlugin: 'Any',
      selectedLevel: 'info',
      logTypes: ['verbose', 'info', 'warn', 'error'],
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
    if (plugins.indexOf(options.plugin) === -1) {
      plugins.push(options.plugin)
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
      selectedLevel: e.target.value,
    })
  },

  handlePluginChange (e) {
    this.setState({
      selectedPlugin: e.target.value,
    })
  },

  allowedLevels () {
    if (this.state.selectedLevel === 'error') {
      return ['error']
    } else if (this.state.selectedLevel === 'warn') {
      return ['error', 'warn']
    } else if (this.state.selectedLevel === 'info') {
      return ['error', 'warn', 'info']
    } else if (this.state.selectedLevel === 'verbose') {
      return ['error', 'warn', 'info', 'verbose']
    }
  },

  render () {
    const allowedLevels = this.allowedLevels()
    return React.createElement(
      'ul',
      null,
      React.createElement(
        'select',
        {
          defaultValue: 'Any',
          onChange: this.handlePluginChange,
        },
        ['Any'].concat(this.state.plugins).map((plugin) => {
          return React.createElement('option', { key: plugin }, plugin)
        })
      ),
      React.createElement(
        'select',
        {
          defaultValue: this.state.selectedLevel,
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
          return ['Any', item.plugin].indexOf(this.state.selectedPlugin) !== -1
        }).filter((item) => {
          return allowedLevels.indexOf(item.level) !== -1
        }).slice(0, 100).map((item, key) => {
          return React.createElement(
            'li',
            { key },
            React.createElement(
              'pre',
              { className: item.level },
              item.level.toUpperCase(), ': ',
              '[' + item.time.toTimeString().split(' ')[0] + ']',
              '[',
                item.plugin,
                item.block ? (':' + item.block) : '',
              '] '
            ),
            React.createElement('pre', null, item.message),
            React.createElement('pre', null, JSON.stringify(item, null, 2))
          )
        })
      )
    )
  },
})

module.exports = Debug
