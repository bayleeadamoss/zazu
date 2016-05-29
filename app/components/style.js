const React = require('react')

const Style = ({css}) => {
  return React.createElement(
    'style',
    null,
    css
  )
}

Style.propTypes = {
  css: React.PropTypes.string.isRequired,
}

module.exports = Style
