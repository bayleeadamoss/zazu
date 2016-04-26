import React from 'react'

const Result = ({ value }) => {
  return (
    <li>{ value.name }</li>
  )
}

Result.propTypes = {
  value: React.PropTypes.object.isRequired,
}

export default Result
