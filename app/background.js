const { app, globalShortcut } = require('electron')
const path = require('path')

const configuration = require('./lib/configuration')
const update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')

const { windowHelper, openCount } = require('./helpers/window')
const forceSingleInstance = require('./helpers/singleInstance')
const addToStartup = require('./helpers/startup')
const createMenu = require('./helpers/menu')

globalEmitter.on('showDebug', (message) => {
  windowHelper('debug', {
    width: 600,
    height: 400,
    resizable: true,
    title: 'Debug Zazu',
    url: path.join('file://', __dirname, '/debug.html'),
  })
})

globalEmitter.on('showAbout', (message) => {
  windowHelper('about', {
    width: 200,
    height: 200,
    resizable: false,
    title: 'About Zazu',
    url: path.join('file://', __dirname, '/about.html'),
  })
})

app.on('ready', function () {
  createMenu()
  update.queueUpdate()
  addToStartup()
  forceSingleInstance()

  globalEmitter.on('registerHotkey', (accelerator) => {
    if (!globalShortcut.isRegistered(accelerator)) {
      globalShortcut.register(accelerator, () => {
        globalEmitter.emit('triggerHotkey', accelerator)
      })
    }
  })

  configuration.load()
  globalShortcut.register(configuration.hotkey, () => {
    globalEmitter.emit('toggleWindow')
  })

  const debug = !!configuration.debug

  const mainWindow = windowHelper('main', {
    width: 600,
    height: 400,
    maxHeight: 400,
    show: debug,
    frame: false,
    resizable: false,
    transparent: true,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    title: 'Zazu',
    autoResize: true,
    url: path.join('file://', __dirname, '/app.html'),
    webPreferences: {
      backgroundThrottling: false,
    },
  })

  if (debug) mainWindow.webContents.toggleDevTools({mode: 'undocked'})

  mainWindow.on('blur', () => {
    if (mainWindow.isVisible()) globalEmitter.emit('hideWindow')
  })

  globalEmitter.on('hideWindow', () => {
    if (debug) return
    mainWindow.hide()
  })

  mainWindow.on('hide', () => {
    if (openCount() === 0) {
      app.hide && app.hide()
    }
  })

  globalEmitter.on('showWindow', () => {
    mainWindow.show()
  })

  globalEmitter.on('toggleWindow', () => {
    globalEmitter.emit(mainWindow.isVisible() ? 'hideWindow' : 'showWindow')
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})
