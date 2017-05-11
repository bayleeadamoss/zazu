const React = require('react')
const PropTypes = require('prop-types')

const IFrame = ({ css, html, id }) => {
  const content = '<style>' + css + '</style>' + html
  return (
    <iframe
      id={id}
      key={html}
      src={'data:text/html;charset=utf-8,' + encodeURI(content)}/>
  )
}

IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  css: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
}

module.exports = IFrame
