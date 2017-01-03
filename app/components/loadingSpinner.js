const React = require('react')
const Style = require('./style')

const LoadingSpinner = ({ loaded, total }) => {
  return React.createElement(
    'div',
    { className: 'container' },
    React.createElement('h2', { className: 'loader' }, 'Zazu is loading...'),
    React.createElement(
      'h3',
      { className: 'loader' },
      `${loaded} of ${total} plugins are loaded`
    ),
    React.createElement(Style, {
      css: `
        body {
          background-color: #5CC7B2;
          margin: 0;
        }
        h2, h3 {
          margin: 0;
          padding: 10px;
          display: block;
          color: #fff;
          text-align: center;
        }
      `,
    })
  )
}

LoadingSpinner.propTypes = {
  loaded: React.PropTypes.number.isRequired,
  total: React.PropTypes.number.isRequired,
}

module.exports = LoadingSpinner
