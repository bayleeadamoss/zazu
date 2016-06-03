const React = require('react')

const Theme = require('./theme')
const configuration = require('./configuration')
const Style = require('./components/style')
const Search = require('./components/search')
const Results = require('./components/results')
const PluginStore = require('./store/pluginStore')
const globalEmitter = require('./lib/globalEmitter')

const Zazu = React.createClass({

  getInitialState () {
    return {
      query: '',
      theme: { css: '' },
      results: [],
    }
  },

  componentDidMount () {
    configuration.load()

    const theme = new Theme(configuration.theme, configuration.pluginDir)
    theme.load().then((theme) => {
      this.setState({
        theme,
      })
    })

    PluginStore.addChangeListener(this.updateResults)

    globalEmitter.on('showWindow', () => {
      this.setState({
        query: '',
        results: [],
      })
    })
  },

  componentWillUnmount () {
    PluginStore.removeChangeListener(this.updateResults)
  },

  updateResults () {
    this.setState({
      results: PluginStore.results,
    })
  },

  handleQueryChange (query) {
    PluginStore.setQuery(query)
    this.setState({
      query,
    })
  },

  handleResultAction (result) {
    result.next()
    globalEmitter.emit('hideWindow')
  },

  render () {
    return React.createElement(
      'div',
      null,
      React.createElement(Style, { css: this.state.theme.css }),
      React.createElement(Search, {
        handleQueryChange: this.handleQueryChange,
        value: this.state.query,
      }),
      React.createElement(Results, {
        values: this.state.results,
        handleResultAction: this.handleResultAction,
      })
    )
  },

})

module.exports = Zazu
