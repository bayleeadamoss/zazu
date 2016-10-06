const { app, globalShortcut } = require('electron')
const path = require('path')

const configuration = require('./lib/configuration')
const update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')
const logger = require('./lib/logger')

const { windowHelper, openCount } = require('./helpers/window')
const forceSingleInstance = require('./helpers/singleInstance')
const addToStartup = require('./helpers/startup')
const createMenu = require('./helpers/menu')

globalEmitter.on('showDebug', (message) => {
  logger.log('info', 'opening debug page')
  windowHelper('debug', {
    width: 600,
    height: 400,
    resizable: true,
    title: 'Debug Zazu',
    url: path.join('file://', __dirname, '/debug.html'),
  })
})

globalEmitter.on('showAbout', (message) => {
  logger.log('info', 'opening about page')
  windowHelper('about', {
    width: 200,
    height: 200,
    resizable: false,
    title: 'About Zazu',
    url: path.join('file://', __dirname, '/about.html'),
  })
})

app.on('ready', function () {
  logger.debug('app is ready')
  createMenu()
  update.queueUpdate()
  forceSingleInstance()
  configuration.load()
  addToStartup(configuration)

  globalEmitter.on('registerHotkey', (accelerator) => {
    if (!globalShortcut.isRegistered(accelerator)) {
      logger.log('verbose', 'registered a hotkey', { hotkey: accelerator })
      globalShortcut.register(accelerator, () => {
        globalEmitter.emit('triggerHotkey', accelerator)
        logger.log('info', 'triggered a hotkey', { hotkey: accelerator })
      })
    }
  })

  logger.log('verbose', 'registering zazu hotkey', { hotkey: configuration.hotkey })
  globalShortcut.register(configuration.hotkey, () => {
    logger.log('info', 'triggered zazu hotkey')
    globalEmitter.emit('toggleWindow')
  })

  const debug = !!configuration.debug
  if (debug) logger.log('verbose', 'debug mode is on')

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
    logger.log('verbose', 'sending hide event signal from blur event')
    if (mainWindow.isVisible()) globalEmitter.emit('hideWindow')
  })

  globalEmitter.on('hideWindow', () => {
    if (debug) return
    logger.log('info', 'hiding window from manual trigger')
    mainWindow.hide()
  })

  mainWindow.on('hide', () => {
    if (openCount() === 0) {
      app.hide && app.hide()
    }
  })

  globalEmitter.on('showWindow', () => {
    logger.log('info', 'showing window from manual trigger')
    mainWindow.show()
  })

  globalEmitter.on('toggleWindow', () => {
    const type = mainWindow.isVisible() ? 'hideWindow' : 'showWindow'
    logger.log('verbose', `sending ${type} event from toggle event`)
    globalEmitter.emit(type)
  })
})

app.on('will-quit', () => {
  logger.log('verbose', 'zazu is closing')
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})
