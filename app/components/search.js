import React from 'react'

export default ({ value, onChange }) => {
  return (
    <input
      type='text'
      onChange={onChange}
      value={value} />
  )
}
