const React = require('react')
const PropTypes = require('prop-types')

const Style = require('./style')

const LoadingSpinner = ({ loaded, total }) => {
  let css = `
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
  `

  return (
    <div className='container'>
      <h2 className='loader'>Zazu is loading...</h2>
      <h3 className='loader'>{loaded} of {total} plugins are loaded</h3>
      <Style css={css}/>
    </div>
  )
}

LoadingSpinner.propTypes = {
  loaded: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

module.exports = LoadingSpinner
