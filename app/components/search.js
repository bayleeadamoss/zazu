import React from 'react'

const Search = ({ value, onChange }) => {
  return (
    <input
      type='text'
      onChange={onChange}
      value={value} />
  )
}

Search.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

export default Search
