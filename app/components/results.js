import React, { PropTypes } from 'react'

import Result from './result'

const Results = React.createClass({
  propTypes: {
    values: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      activeIndex: 0,
    }
  },

  componentDidMount: () => {
    Mousetrap.bind(['ctrl+p', 'up'], () => {
      if (this.state.activeIndex === 0) {
        this.setState({
          activeIndex: this.props.values.length - 1,
        })
      } else {
        this.setState({
          activeIndex: this.state.activeIndex - 1,
        })
      }
    })
    Mousetrap.bind(['enter'], () => {
      this.props.onClick(this.props.values[this.state.activeIndex])
    })
    Mousetrap.bind(['ctrl+n', 'down'], () => {
      if (this.state.activeIndex + 0 >= this.props.values.length) {
        this.setState({
          activeIndex: 0,
        })
      } else {
        this.setState({
          activeIndex: this.state.activeIndex + 1,
        })
      }
    })
  },

  componentWillUnmount: () => {
    Mousetrap.unbind('command+p')
    Mousetrap.unbind('command+n')
    Mousetrap.unbind('up')
    Mousetrap.unbind('down')
    Mousetrap.unbind('enter')
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
    const { values, onClick } = this.props
    return (
      <ul>
        { values.map((value, i) => {
          return <Result
            active={i === activeIndex}
            activate={this.activate}
            value={value}
            onClick={onClick}
            key={i} />
        }) }
      </ul>
    )
  },

})

export default Results
