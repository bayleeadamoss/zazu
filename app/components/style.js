import React from 'react'

const Style = ({css}) => {
  return (
    <style>
      { css }
    </style>
  )
}

Style.propTypes = {
  css: React.PropTypes.string.isRequired,
}

export default Style
