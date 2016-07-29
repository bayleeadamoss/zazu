const React = require('react')

const Theme = require('./theme')
const configuration = require('./configuration')
const Style = require('./components/style')
const Search = require('./components/search')
const Results = require('./components/results')
const PluginStore = require('./store/pluginStore')
const globalEmitter = require('./lib/globalEmitter')
const ResultSorter = require('./lib/resultSorter')
const track = require('./lib/track')

const Zazu = React.createClass({

  getInitialState () {
    return {
      query: '',
      theme: { css: '' },
      results: [],
    }
  },

  componentDidMount () {
    configuration.load().then(() => {
      const theme = new Theme(configuration.theme, configuration.pluginDir)
      track.setAttribute('zazuTheme', configuration.theme)
      theme.load().then((theme) => {
        this.setState({
          theme,
        })
      })
    })

    PluginStore.load()

    PluginStore.addResultListener(this.updateResults)

    globalEmitter.on('showWindow', () => {
      setImmediate(() => PluginStore.setQuery(''))
      this.setState({
        query: '',
        results: [],
      })
    })
  },

  componentWillUnmount () {
    PluginStore.removeResultListener(this.updateResults)
  },

  updateResults () {
    this.setState({
      results: new ResultSorter(PluginStore.results).sort(),
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
    ResultSorter.trackClick({
      id: result.id,
      pluginName: result.pluginName,
    })
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
