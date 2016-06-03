const React = require('react')
const Mousetrap = require('mousetrap')

const Result = require('./result')
const globalEmitter = require('../lib/globalEmitter')

const { PropTypes } = React

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
    Mousetrap.bind(['ctrl+p', 'ctrl+j', 'up'], () => {
      this.moveUp()
    })
    Mousetrap.bind(['ctrl+n', 'ctrl+k', 'down'], () => {
      this.moveDown()
    })
    Mousetrap.bind('enter', () => {
      const { activeIndex } = this.state
      const { values, handleResultAction } = this.props
      handleResultAction(values[activeIndex])
    })
    Mousetrap.bind('esc', () => {
      globalEmitter.emit('hideWindow')
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
    return React.createElement(
      'ul',
      null,
      values.map((value, i) => {
        return React.createElement(Result, {
          active: i === activeIndex,
          activate: this.activate,
          value: value,
          onClick: handleResultAction,
          key: i,
        })
      })
    )
  },

})

module.exports = Results
