const React = require('react')

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
  id: React.PropTypes.string.isRequired,
  css: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
}

module.exports = IFrame
