const React = require('react')
const PropTypes = require('prop-types')
const { Markup } = require('interweave')

const keyboard = require('../lib/keyboard')
const Result = require('./result')
const globalEmitter = require('../lib/globalEmitter')
const Style = require('./style')

class Results extends React.Component {
  moveUp = () => {
    const { values, activeIndex } = this.props
    const prevIndex = activeIndex - 1
    const lastIndex = values.length - 1
    const index = prevIndex < 0 ? lastIndex : prevIndex
    this.context.logger.log('info', 'move up', { index, activeIndex })
    this.props.handleUpdateActiveIndex(index)
  }

  moveDown = () => {
    const { values, activeIndex } = this.props
    const nextIndex = activeIndex + 1
    const index = nextIndex >= values.length ? 0 : nextIndex
    this.context.logger.log('info', 'move down', { index, activeIndex })
    this.props.handleUpdateActiveIndex(index)
  }

  handleTab = result => {
    const index = this.props.values.indexOf(result)
    this.props.handleUpdateActiveIndex(index)
  }

  componentDidMount () {
    keyboard.bind('results', ['ctrl+p', 'ctrl+k', 'up'], () => {
      this.moveUp()
    })
    keyboard.bind('results', ['ctrl+n', 'ctrl+j', 'down'], () => {
      this.moveDown()
    })
    keyboard.bind('results', 'enter', () => {
      const { values, handleResultClick, activeIndex } = this.props
      handleResultClick(values[activeIndex])
    })
    keyboard.bind('results', 'esc', () => {
      globalEmitter.emit('hideWindow')
    })
  }

  componentWillUnmount () {
    keyboard.unbind('results')
  }

  renderPreviewFrame = () => {
    const { values, activeIndex } = this.props
    const activeResult = values.find((result, i) => i === activeIndex && typeof result.preview === 'string')
    if (!activeResult) return
    const style = activeResult.previewCss ? `<style>${activeResult.previewCss}</style>` : ''
    return [
      <Style
        key="preview-style"
        css={`
          div.results blockquote {
            max-width: 70%;
            overflow: auto;
          }
        `}
      />,
      <Markup tagName="blockquote" id="preview" key="preview" content={`${style}${activeResult.preview}`} />,
    ]
  }

  render () {
    const { values, handleResultClick, activeIndex } = this.props
    if (values.length === 0) {
      return null
    }

    return (
      <div className="results" style={{ overflowY: 'auto' }}>
        <ul style={{ maxHeight: 'inherit' }} key="result-list">
          {values.map((result, i) => {
            return (
              <Result
                active={i === activeIndex}
                value={result}
                onClick={handleResultClick}
                handleTab={this.handleTab}
                key={JSON.stringify(result) + i}
              />
            )
          })}
        </ul>
        {this.renderPreviewFrame()}
      </div>
    )
  }
}

Results.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired,
  handleResultClick: PropTypes.func.isRequired,
  handleUpdateActiveIndex: PropTypes.func.isRequired,
}

Results.contextTypes = {
  logger: PropTypes.object.isRequired,
}

module.exports = Results
