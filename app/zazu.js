import Theme from './theme'
import configuration from './configuration'
import Style from './components/style'
import Search from './components/search'
import Results from './components/results'
import PluginStore from './store/pluginStore'

import { remote, ipcRenderer } from 'electron'
import React from 'react'

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
    console.log('updating results', PluginStore.results)
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
    console.log('hello', result.name)
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

export default Zazu
