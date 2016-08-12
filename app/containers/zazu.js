const React = require('react')

const Style = require('../components/style')
const Search = require('../components/search')
const Results = require('../components/results')
const globalEmitter = require('../lib/globalEmitter')

const Zazu = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    theme: React.PropTypes.string.isRequired,
    results: React.PropTypes.array.isRequired,
    handleResetQuery: React.PropTypes.func.isRequired,
    handleResultClick: React.PropTypes.func.isRequired,
    handleQueryChange: React.PropTypes.func.isRequired,
    scopeBlock: React.PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      activeIndex: 0,
    }
  },

  componentDidMount () {
    globalEmitter.on('hideWindow', this.handleResetQuery)
    globalEmitter.on('showWindow', this.sendEmptyQuery)
  },

  componentWillUnmount () {
    globalEmitter.removeListener('hideWindow', this.handleResetQuery)
    globalEmitter.removeListener('showWindow', this.sendEmptyQuery)
  },

  sendEmptyQuery (activePlugin, activeBlock) {
    this.props.scopeBlock(activePlugin, activeBlock)
    this.props.handleQueryChange('')
    this.setState({
      activeIndex: 0,
    })
  },

  handleResetQuery () {
    this.props.handleResetQuery()
  },

  handleUpdateActiveIndex (index) {
    this.setState({
      activeIndex: index,
    })
  },

  handleResultClick (result) {
    globalEmitter.emit('hideWindow')
    this.props.handleResultClick(result)
  },

  handleQueryChange (query) {
    this.props.handleQueryChange(query)
    this.setState({
      activeIndex: 0,
    })
  },

  render () {
    const { query, results, theme } = this.props
    return React.createElement(
      'div',
      null,
      React.createElement(Style, { css: theme }),
      React.createElement(Search, {
        handleQueryChange: this.handleQueryChange,
        value: query,
      }),
      React.createElement(Results, {
        values: results,
        activeIndex: this.state.activeIndex,
        handleResultClick: this.handleResultClick,
        handleUpdateActiveIndex: this.handleUpdateActiveIndex,
      })
    )
  },

})

module.exports = Zazu
