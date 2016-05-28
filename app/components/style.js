const React = require('react')

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

module.exports = Style
