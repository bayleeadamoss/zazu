const { BrowserWindow } = require('electron')

const autoResize = (dynamicWindow) => {
  const defaultSize = {
    width: dynamicWindow.getSize()[0],
    height: dynamicWindow.getSize()[1],
  }

  let currentHeight = defaultSize.height
  const resize = (height) => {
    if (height !== currentHeight) {
      currentHeight = height
      dynamicWindow.setSize(defaultSize.width, height)
    }
  }

  dynamicWindow.webContents.on('did-finish-load', () => {
    const updateHeight = () => {
      if (!dynamicWindow || !dynamicWindow.isVisible()) { return }
      dynamicWindow.webContents.executeJavaScript('document.body.children[0].offsetHeight', (mainContentHeight) => {
        resize(mainContentHeight)
      })
    }
    const id = setInterval(updateHeight, 125)
    dynamicWindow.on('closed', () => {
      clearInterval(id)
    })
  })
}

const namedWindows = {}

const openCount = () => {
  return Object.keys(namedWindows).reduce((memo, windowName) => {
    const namedWindow = namedWindows[windowName]
    if (namedWindow) {
      if (namedWindow.isVisible()) memo++
      if (namedWindow.webContents.isDevToolsOpened()) memo++
    }
    return memo
  }, 0)
}

const windowHelper = (name, options) => {
  if (namedWindows[name]) {
    namedWindows[name].focus()
    return namedWindows[name]
  }

  namedWindows[name] = new BrowserWindow(options)
  if (options.autoResize) {
    autoResize(namedWindows[name])
  }

  namedWindows[name].on('closed', () => {
    namedWindows[name] = null
  })

  namedWindows[name].loadURL(options.url)

  return namedWindows[name]
}

module.exports = {
  windowHelper,
  openCount,
}
