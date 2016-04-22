import Theme from './theme'
import configuration from './configuration'

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
          { value: 'Blaine' },
          { value: 'Jared' },
          { value: 'Adam' },
          { value: 'Micah' },
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

  render () {
    return (
      <div>
        <style>
          { this.state.theme.css }
        </style>
        <input
          type='text'
          onChange={this.handleChange}
          value={this.state.query} />
        <ul>
          {this.state.results.map((item) => {
            return (
              <li onclick={() => { this.action(item) } }>{item.value}</li>
            )
          })}
        </ul>
      </div>
    )
  },

})

export default Zazu
