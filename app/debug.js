const ReactDOM = require('react-dom')
const React = require('react')

const globalEmitter = require('./lib/globalEmitter')

const Debug = React.createClass({
  getInitialState () {
    return {
      selectedPlugin: 'Any',
      items: [],
    }
  },

  log (options) {
    const items = Object.assign([], this.state.items)
    items.unshift(Object.assign({}, options, {
      time: new Date(),
    }))
    this.setState({
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

  handleChange (e) {
    this.setState({
      selectedPlugin: e.target.value,
    })
  },

  render () {
    return React.createElement(
      'ul',
      null,
      React.createElement(
        'select',
        {
          defaultValue: 'Any',
          onChange: this.handleChange,
        },
        this.state.items.reduce((memo, item) => {
          if (memo.indexOf(item.pluginId) === -1) {
            memo.push(item.pluginId)
          }
          return memo
        }, ['Any']).map((pluginId) => {
          return React.createElement('option', { key: pluginId }, pluginId)
        })
      ),
      React.createElement(
        'ul',
        null,
        this.state.items.filter((item) => {
          return ['Any', item.pluginId].indexOf(this.state.selectedPlugin) !== -1
        }).map((item, key) => {
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

ReactDOM.render(
  React.createElement(Debug),
  document.getElementById('debug')
)
