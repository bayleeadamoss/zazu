const electron = require('electron')
const globalEmitter = require('../lib/globalEmitter')
const { BrowserWindow } = process.type === 'renderer' ? electron.remote : electron

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

  const updateHeight = () => {
    if (!dynamicWindow) { return }
    dynamicWindow.webContents.executeJavaScript('document.body.children[0].offsetHeight', (mainContentHeight) => {
      resize(mainContentHeight)
    })
  }

  let updateHeightIntervalId = null
  const clearUpdateHeightInterval = () => {
    if (updateHeightIntervalId) {
      clearInterval(updateHeightIntervalId)
      updateHeightIntervalId = null
    }
  }

  // register updateHeight interval only when dynamicWindow is visible
  const registerUpdateHeightInterval = () => {
    clearUpdateHeightInterval()
    if (dynamicWindow.isVisible()) {
      // avoid 125ms delay and redraw the window right away
      updateHeight()
      updateHeightIntervalId = setInterval(updateHeight, 125)
    }
  }

  dynamicWindow.webContents.on('did-finish-load', () => {
    // remove the interval as soon as the dynamicWindow is not visible or destroyed
    dynamicWindow.on('closed', clearUpdateHeightInterval)
    dynamicWindow.on('hide', clearUpdateHeightInterval)

    // reregister the interval as soon as the window is visible
    dynamicWindow.on('show', () => {
      registerUpdateHeightInterval()
    })

    // if the window is already visible, the interval should be set
    registerUpdateHeightInterval()
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
    globalEmitter.emit('debuggerClosed')
  })

  namedWindows[name].loadURL(options.url)

  return namedWindows[name]
}

module.exports = {
  windowHelper,
  openCount,
}
