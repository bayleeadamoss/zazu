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

  renderPreviewFrame () {
    const { values, activeIndex } = this.props
    var activeResult = values.find((result, i) => i === activeIndex && result.preview)
    if (!activeResult) return

    return (
      <IFrame
        id='preview'
        key='preview'
        css={activeResult.previewCss}
        html={activeResult.preview}/>
    )
  },

  render () {
    const { values, handleResultClick, activeIndex } = this.props
    if (values.length === 0) { return null }

    return (
      <div className='results'>
        <ul>
          {values.map((result, i) => {
            return (
              <Result
                active={i === activeIndex}
                value={result}
                onClick={handleResultClick}
                handleTab={this.handleTab}
                key={i}/>
            )
          })}
        </ul>
        {this.renderPreviewFrame()}
      </div>
    )
  },

})

module.exports = Results
