const ReactDOM = require('react-dom')
const React = require('react')

const ConfigWrapper = require('./containers/configWrapper')
const PluginWrapper = require('./containers/pluginWrapper')

ReactDOM.render(
  <ConfigWrapper>
    <PluginWrapper />
  </ConfigWrapper>,
  document.getElementById('zazu')
)

// Catch `esc` or `enter` to avoid alert beep.
document.body.onkeydown = e => {
  return e.key !== 'Enter' && e.key !== 'Escape'
}
