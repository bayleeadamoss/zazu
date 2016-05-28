const Theme = require('./theme')
const configuration = require('./configuration')
const Style = require('./components/style')
const Search = require('./components/search')
const Results = require('./components/results')
const PluginStore = require('./store/pluginStore')

const { remote, ipcRenderer } = require('electron')
const React = require('react')

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

    remote.getCurrentWindow().on('show', () => {
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
    ipcRenderer.send('hideWindow')
  },

  render () {
    return (
      <div>
        <Style css={this.state.theme.css} />
        <Search
          handleQueryChange={this.handleQueryChange}
          value={this.state.query} />
        <Results
          values={this.state.results}
          handleResultAction={this.handleResultAction} />
      </div>
    )
  },

})

module.exports = Zazu
