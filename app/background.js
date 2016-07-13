const { app, Menu, Tray, systemPreferences } = require('electron')
const globalShortcut = require('global-shortcut')
const path = require('path')
const AutoLaunch = require('auto-launch')

const { menuTemplate } = require('./helpers/menu_template')
const { windowHelper } = require('./helpers/window')
const configuration = require('./configuration')
const Update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')
const env = require('./env')

let mainWindow, tray

const setApplicationMenu = () => {
  if (app.dock) app.dock.hide()
  const iconName = systemPreferences.isDarkMode() ? 'tray-icon-white.png' : 'tray-icon.png'
  const iconPath = path.join(app.getAppPath(), 'images', iconName)
  tray = new Tray(iconPath)
  tray.setToolTip('Toggle Zazu')
  tray.setContextMenu(Menu.buildFromTemplate(menuTemplate))
}

const checkForUpdate = () => {
  const update = new Update()
  update.check()
}

const addToStartup = () => {
  if (env.name === 'production') {
    const appLauncher = new AutoLaunch({
      name: 'Zazu App',
    })

    appLauncher.isEnabled().then((enabled) => {
      if (enabled) return
      return appLauncher.enable()
    })
  }
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    globalEmitter.emit('showWindow')
  }
})

if (shouldQuit) {
  app.quit()
}

app.on('ready', function () {
  setApplicationMenu()

  mainWindow = windowHelper({
    width: 600,
    height: 400,
    maxHeight: 400,
    show: false,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    title: 'Zazu',
  })

  checkForUpdate()
  addToStartup()

  // mainWindow.webContents.toggleDevTools();

  globalEmitter.on('message', (message) => {
    console.log('message:', message)
  })

  globalEmitter.on('hideWindow', () => {
    mainWindow.hide()
  })

  globalEmitter.on('showWindow', () => {
    mainWindow.show()
  })

  globalEmitter.on('toggleWindow', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  globalEmitter.on('registerHotkey', (accelerator) => {
    if (!globalShortcut.isRegistered(accelerator)) {
      globalShortcut.register(accelerator, () => {
        globalEmitter.emit('triggerHotkey', accelerator)
      })
    }
  })

  mainWindow.on('blur', () => {
    globalEmitter.emit('hideWindow')
  })

  configuration.load().then(() => {
    globalShortcut.register(configuration.hotkey, () => {
      if (mainWindow.isVisible()) {
        globalEmitter.emit('hideWindow')
      } else {
        globalEmitter.emit('showWindow')
      }
    })
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/app.html'))
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})
