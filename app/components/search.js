import React from 'react'

const Search = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    handleQueryChange: React.PropTypes.func.isRequired,
  },

  componentDidMount () {
    this.input.focus()
  },

  handleQueryChange (event) {
    const query = event.target.value
    this.props.handleQueryChange(query)
  },

  render () {
    const { onChange, value } = this.props
    return (
      <input
        ref={(ref) => this.input = ref}
        type='text'
        onChange={this.handleQueryChange}
        value={value} />
    )
  },
})

export default Search
