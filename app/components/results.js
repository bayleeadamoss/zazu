const React = require('react')
const Mousetrap = require('mousetrap')

const Result = require('./result')
const IFrame = require('./iframe')
const globalEmitter = require('../lib/globalEmitter')

const { PropTypes } = React

const Results = React.createClass({
  propTypes: {
    activeIndex: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    handleResultClick: PropTypes.func.isRequired,
    handleUpdateActiveIndex: PropTypes.func.isRequired,
  },

  contextTypes: {
    logger: React.PropTypes.object.isRequired,
  },

  moveUp () {
    const { values, activeIndex } = this.props
    const prevIndex = activeIndex - 1
    const lastIndex = values.length - 1
    const index = prevIndex < 0 ? lastIndex : prevIndex
    this.context.logger.log('info', 'move up', { index, activeIndex })
    this.props.handleUpdateActiveIndex(index)
  },

  moveDown () {
    const { values, activeIndex } = this.props
    const nextIndex = activeIndex + 1
    const index = nextIndex >= values.length ? 0 : nextIndex
    this.context.logger.log('info', 'move down', { index, activeIndex })
    this.props.handleUpdateActiveIndex(index)
  },

  handleTab (result) {
    const index = this.props.values.indexOf(result)
    this.props.handleUpdateActiveIndex(index)
  },

  componentDidMount () {
    Mousetrap.bind(['ctrl+p', 'ctrl+k', 'up'], () => {
      this.moveUp()
    })
    Mousetrap.bind(['ctrl+n', 'ctrl+j', 'down'], () => {
      this.moveDown()
    })
    Mousetrap.bind('enter', () => {
      const { values, handleResultClick, activeIndex } = this.props
      handleResultClick(values[activeIndex])
    })
    Mousetrap.bind('esc', () => {
      globalEmitter.emit('hideWindow')
    })
  },

  componentWillUnmount () {
    Mousetrap.reset()
  },

  render () {
    const { values, handleResultClick, activeIndex } = this.props
    if (values.length === 0) { return null }
    return React.createElement(
      'div',
      { className: 'results' },
      React.createElement(
        'ul',
        {},
        values.map((result, i) => {
          return React.createElement(Result, {
            active: i === activeIndex,
            value: result,
            onClick: handleResultClick,
            handleTab: this.handleTab,
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
