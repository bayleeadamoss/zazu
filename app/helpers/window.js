// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

const { BrowserWindow } = require('electron')
const globalEmitter = require('../lib/globalEmitter')

const windowHelper = (options) => {
  const defaultSize = {
    width: options.width,
    height: options.height,
  }

  const resize = (height) => {
    if (height !== currentHeight) {
      currentHeight = height
      mainWindow.setSize(defaultSize.width, height)
    }
  }

  const mainWindow = new BrowserWindow(options)
  let currentHeight = defaultSize.height

  mainWindow.webContents.on('did-finish-load', () => {
    const updateHeight = () => {
      if (!mainWindow.isVisible) { return }
      mainWindow.webContents.executeJavaScript('document.body.children[0].offsetHeight', (mainContentHeight) => {
        resize(mainContentHeight)
      })
    }
    const id = setInterval(updateHeight, 500)
    globalEmitter.on('quitApp', () => {
      clearInterval(id)
    })
  })

  return mainWindow
}

module.exports = {
  windowHelper,
}
