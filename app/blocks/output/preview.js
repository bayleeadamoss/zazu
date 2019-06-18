const Block = require('../block')
const Template = require('../../lib/template')
const { windowHelper } = require('../../helpers/window')
const path = require('path')
const Screens = require('../../lib/screens')

class Preview extends Block {
  constructor (data) {
    super(data)
    this.message = data.message || '{value}'
    this.screens = Screens.getInstance({
      windowWidth: 700,
    })
  }

  call (state, env = {}) {
    const win = windowHelper('preview-block', {
      show: false,
      width: 700,
      height: 500,
      frame: false,
      resizable: false,
      autoResize: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      title: 'Large Type',
      url: path.join('file://', path.dirname(path.dirname(__dirname)), '/preview.html'),
      webPreferences: {
        nodeIntegration: true,
      },
    })
    const position = this.screens.getCenterPositionOnCurrentScreen()
    if (position) {
      win.setPosition(position.x, position.y)
    }
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('message', Template.compile(this.message, {
        value: String(state.value),
      }))
    })
    return new Promise((resolve) => {
      win.on('blur', () => {
        win.close()
      })
      win.on('close', () => {
        resolve()
      })
    }).then(() => {
      return state.next()
    })
  }
}

module.exports = Preview
