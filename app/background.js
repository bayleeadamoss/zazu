const { dialog, app, globalShortcut } = require('electron')
const path = require('path')

const Screens = require('./lib/screens')
const configuration = require('./lib/configuration')
const update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')
const logger = require('./lib/logger')

const { windowHelper, openCount } = require('./helpers/window')
const forceSingleInstance = require('./helpers/singleInstance')
const addToStartup = require('./helpers/startup')
const { createMenu } = require('./helpers/menu')
const about = require('./about')

globalEmitter.on('showDebug', message => {
  logger.log('info', 'opening debug page')
  windowHelper('debug', {
    width: 600,
    height: 400,
    resizable: true,
    title: 'Debug Zazu',
    url: path.join('file://', __dirname, '/debug.html'),
    webPreferences: {
      nodeIntegration: true,
    },
  })
  globalEmitter.emit('debuggerOpened')
})

globalEmitter.on('showAbout', message => {
  logger.log('info', 'opening about page')
  about.show()
})

globalEmitter.on('reloadConfig', message => {
  app.relaunch()
  app.exit()
})

globalEmitter.on('quit', () => app.quit())

app.on('ready', function () {
  if (!configuration.load()) {
    return dialog.showMessageBox(
      {
        type: 'error',
        message: 'You have an invalid ~/.zazurc.json file.',
        detail: 'Please edit your ~/.zazurc.json file and try loading Zazu again.',
        defaultId: 0,
        buttons: ['Ok'],
      },
      () => {
        app.quit()
      }
    )
  }
  logger.debug('app is ready', {
    version: app.getVersion(),
  })
  createMenu()
  update.queueUpdate()
  forceSingleInstance()
  addToStartup(configuration)

  globalEmitter.on('registerHotkey', accelerator => {
    if (!globalShortcut.isRegistered(accelerator)) {
      logger.log('verbose', 'registered a hotkey', { hotkey: accelerator })
      try {
        globalShortcut.register(accelerator, () => {
          globalEmitter.emit('triggerHotkey', accelerator)
          logger.log('info', 'triggered a hotkey', { hotkey: accelerator })
        })
      } catch (e) {
        logger.log('error', 'failed to register hotkey', { hotkey: accelerator })
      }
    }
  })

  logger.log('verbose', 'registering zazu hotkey', { hotkey: configuration.hotkey })
  globalShortcut.register(configuration.hotkey, () => {
    logger.log('info', 'triggered zazu hotkey')
    globalEmitter.emit('toggleWindow')
  })

  const debug = !!configuration.debug
  if (debug) logger.log('verbose', 'debug mode is on')

  const windowHeight = configuration.height
  const isWindows = process.platform === 'win32'
  const mainWindow = windowHelper('main', {
    width: 600,
    height: windowHeight,
    maxHeight: windowHeight,
    show: false,
    frame: false,
    resizable: false,
    transparent: !isWindows,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    title: 'Zazu',
    autoResize: true,
    url: path.join('file://', __dirname, '/app.html'),
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
  })

  const screens = Screens.getInstance({
    windowWidth: mainWindow.getSize()[0],
  })

  if (debug) mainWindow.webContents.toggleDevTools({ mode: 'undocked' })

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

  mainWindow.on('move', () => {
    const currentWindowPosition = mainWindow.getPosition()
    screens.saveWindowPositionOnCurrentScreen(currentWindowPosition[0], currentWindowPosition[1])
  })

  mainWindow.on('moved', () => {
    const currentWindowPosition = mainWindow.getPosition()
    screens.saveWindowPositionOnCurrentScreen(currentWindowPosition[0], currentWindowPosition[1])
  })

  globalEmitter.on('showWindow', () => {
    logger.log('info', 'showing window from manual trigger')
    const position = screens.getCenterPositionOnCurrentScreen()
    if (position) {
      mainWindow.setPosition(position.x, position.y)
    }
    mainWindow.show()
    mainWindow.focus()
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
