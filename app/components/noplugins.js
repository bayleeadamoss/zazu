const React = require('react')
const Style = require('./style')
const {shell} = require('electron')


const NoPlugins = () => {
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
    a {
      color: #EBEBEB;
    }
  `

  return (
    <div className='container'>
      <h2 className='loader'>Zazu requires plugins to work!</h2>
      <h3 className='loader'>Have a look at the <a href='#' onClick={ () => { shell.openExternal('http://zazuapp.org/plugins/') } }>Zazu Plugins</a> page.</h3>
      <Style css={css}/>
    </div>
  )
}

module.exports = NoPlugins
