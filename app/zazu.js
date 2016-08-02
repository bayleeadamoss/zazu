const React = require('react')

const Style = require('./components/style')
const Search = require('./components/search')
const Results = require('./components/results')
const PluginStore = require('./store/pluginStore')
const globalEmitter = require('./lib/globalEmitter')
const ResultSorter = require('./lib/resultSorter')

const Zazu = React.createClass({

  getInitialState () {
    return {
      query: '',
      theme: { css: '' },
      results: [],
    }
  },

  componentDidMount () {
    PluginStore.addThemeListener(this.updateTheme)
    PluginStore.addResultListener(this.updateResults)
    PluginStore.addQueryListener(this.updateQuery)

    PluginStore.load().then(() => {
      globalEmitter.on('hideWindow', () => {
        PluginStore.resetQuery()
      })
      globalEmitter.on('showWindow', () => {
        PluginStore.setQuery('')
      })
    })
  },

  componentWillUnmount () {
    PluginStore.removeThemeListener(this.updateTheme)
    PluginStore.removeResultListener(this.updateResults)
    PluginStore.removeQueryListener(this.updateQuery)
  },

  updateTheme (theme) {
    this.setState({
      theme,
    })
  },

  updateResults (results) {
    this.setState({
      results: new ResultSorter(results).sort(),
    })
  },

  updateQuery (query) {
    this.setState({
      query,
    })
  },

  handleQueryChange (query) {
    PluginStore.setQuery(query)
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
