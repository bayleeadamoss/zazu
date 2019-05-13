const React = require('react')
const PropTypes = require('prop-types')

const Style = ({ css }) => {
  return React.createElement('style', null, css)
}

Style.propTypes = {
  css: PropTypes.string.isRequired,
}

module.exports = Style
