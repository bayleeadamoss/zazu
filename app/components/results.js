import React, { PropTypes } from 'react'
import { ipcRenderer } from 'electron'
import Mousetrap from 'mousetrap'

import Result from './result'

const Results = React.createClass({
  propTypes: {
    values: PropTypes.array.isRequired,
    handleResultAction: PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      activeIndex: 0,
    }
  },

  moveUp () {
    const { activeIndex } = this.state
    const { values } = this.props
    const prevIndex = activeIndex - 1

    if (prevIndex < 0) {
      const lastIndex = values.length - 1
      this.activate(values[lastIndex])
    } else {
      this.activate(values[prevIndex])
    }
  },

  moveDown () {
    const { activeIndex } = this.state
    const { values } = this.props
    const nextIndex = activeIndex + 1

    if (nextIndex >= values.length) {
      this.activate(values[0])
    } else {
      this.activate(values[nextIndex])
    }
  },

  componentDidMount () {
    const { activeIndex } = this.state
    const { values, handleResultAction } = this.props

    Mousetrap.bind(['ctrl+p', 'up'], () => {
      this.moveUp()
    })
    Mousetrap.bind(['ctrl+n', 'down'], () => {
      this.moveDown()
    })
    Mousetrap.bind('enter', () => {
      handleResultAction(values[activeIndex])
    })
    Mousetrap.bind('esc', () => {
      ipcRenderer.send('hideWindow')
    })
  },

  componentWillUnmount: () => {
    Mousetrap.reset()
  },

  activate (item) {
    var index = this.props.values.indexOf(item)
    if (index > -1) {
      this.setState({
        activeIndex: index,
      })
    }
  },

  render () {
    const { activeIndex } = this.state
    const { values, handleResultAction } = this.props
    return (
      <ul>
        { values.map((value, i) => {
          return <Result
            active={i === activeIndex}
            activate={this.activate}
            value={value}
            onClick={handleResultAction}
            key={i} />
        }) }
      </ul>
    )
  },

})

export default Results
