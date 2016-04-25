import Theme from './theme'
import configuration from './configuration'
import Style from './components/style'
import Search from './components/search'
import Results from './components/results'

import React from 'react'

const Zazu = React.createClass({

  getInitialState () {
    return {
      theme: '',
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

    setTimeout(() => {
      this.setState({
        results: [
          { name: 'Blaine' },
          { name: 'Jared' },
          { name: 'Adam' },
          { name: 'Micah' },
        ],
      })
    }, 1000)
  },

  handleChange (event) {
    const query = event.target.value
    this.setState({
      query,
    })
  },

  handleAction () {
    alert('yes')
  },

  render () {
    return (
      <div>
        <Style css={this.state.theme.css} />
        <Search
          onChange={this.handleChange}
          value={this.state.query} />
        <Results
          values={this.state.results}
          onClick={this.handleAction} />
      </div>
    )
  },

})

export default Zazu
