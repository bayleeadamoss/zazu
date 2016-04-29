import { remote, ipcRenderer } from 'electron'
import ReactDOM from 'react-dom'
import React from 'react'

import Zazu from './zazu'

window.onerror = function (e) {
  ipcRenderer.send('exception', e)
}

// smell
remote.getCurrentWindow().on('show', () => {
  const input = document.getElementsByTagName('input')[0]
  input && input.focus()
})

ReactDOM.render(
  <Zazu />,
  document.getElementById('zazu')
)
