const React = require('react')
const Mousetrap = require('mousetrap')

const Result = require('./result')
const IFrame = require('./iframe')
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
    if (values.length === 0) { return null }
    return React.createElement(
      'div',
      { className: 'results' },
      React.createElement(
        'ul',
        null,
        values.map((result, i) => {
          return React.createElement(Result, {
            active: i === activeIndex,
            activate: this.activate,
            value: result,
            onClick: handleResultAction,
            key: i,
          })
        })
      ),
      values.filter((result, i) => {
        return i === activeIndex && result.preview
      }).reduce((memo, result) => {
        return React.createElement(
          IFrame,
          {
            id: 'preview',
            css: result.previewCss,
            html: result.preview,
          }
        )
      }, null)
    )
  },

})

module.exports = Results
