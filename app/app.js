import { remote } from 'electron'
import ReactDOM from 'react-dom'

import Zazu from './zazu'

// smell
remote.getCurrentWindow().on('show', () => {
  const input = document.getElementsByTagName('input')[0]
  input && input.focus()
})

ReactDOM.render(
  <Zazu />,
  document.getElementById('zazu')
)
