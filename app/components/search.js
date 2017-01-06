const React = require('react')

const Search = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    handleQueryChange: React.PropTypes.func.isRequired,
  },

  getInitialState () {
    return {
      input: null,
    }
  },

  focus () {
    this.state.input && this.state.input.focus()
  },

  componentDidMount () {
    this.focus()
  },

  componentDidUpdate () {
    if (this.props.value === '') {
      this.focus()
    }
  },

  handleQueryChange (event) {
    const query = event.target.value
    this.props.handleQueryChange(query)
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
        value={value}/>
    )
  },
})

module.exports = Search
