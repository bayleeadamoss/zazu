const React = require('react')
const globalEmitter = require('../lib/globalEmitter')
const keyboard = require('../lib/keyboard')
const mergeUnique = require('../lib/mergeUnique')

const Search = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    handleQueryChange: React.PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      input: null,
      history: [],
    }
  },

  focus () {
    this.state.input && this.state.input.focus()
  },

  handleSaveQuery () {
    if (!this.props.value) return
    const haystack = mergeUnique(this.props.value, this.state.history)
    this.setState({
      historyId: -1,
      history: haystack.slice(0, 10),
    })
  },

  handlePreviousSearch () {
    const historyId = this.state.historyId + 1
    this.props.handleQueryChange(this.state.history[historyId])
    this.setState({
      historyId,
    })
  },

  handleNextSearch () {
    const historyId = this.state.historyId - 1
    this.props.handleQueryChange(this.state.history[historyId])
    this.setState({
      historyId,
    })
  },

  componentDidMount () {
    globalEmitter.on('hideWindow', this.handleSaveQuery)
    keyboard.bind('search', 'ctrl+h', () => {
      this.handlePreviousSearch()
    })
    keyboard.bind('search', 'ctrl+l', () => {
      this.handleNextSearch()
    })
    this.focus()
  },

  componentWillUnmount () {
    globalEmitter.removeListener('hideWindow', this.handleSaveQuery)
    keyboard.reset('search')
  },

  componentDidUpdate () {
    if (this.props.value === '') {
      this.focus()
    }
  },

  handleQueryChange (event) {
    const query = event.target.value
    this.props.handleQueryChange(query)
    this.setState({
      historyId: -1,
    })
  },

  setReference (input) {
    this.setState({
      input,
    })
  },

  render () {
    const { value } = this.props

    return (
      <input
        title='Search Zazu'
        className='mousetrap'
        ref={this.setReference}
        type='text'
        onChange={this.handleQueryChange}
        value={value} />
    )
  },
})

module.exports = Search
