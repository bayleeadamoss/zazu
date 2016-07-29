const { app, Menu, Tray, systemPreferences, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const AutoLaunch = require('auto-launch')

const { trayTemplate, appTemplate } = require('./helpers/menu_template')
const { windowHelper } = require('./helpers/window')
const configuration = require('./configuration')
const Update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')
const env = require('./env')

let mainWindow, tray, aboutWindow, debugWindow

const setApplicationMenu = () => {
  if (app.dock) app.dock.hide()
  const iconName = systemPreferences.isDarkMode() ? 'tray-icon-white.png' : 'tray-icon.png'
  const iconPath = path.join(app.getAppPath(), 'images', iconName)
  tray = new Tray(iconPath)
  tray.setToolTip('Toggle Zazu')
  tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
  Menu.setApplicationMenu(Menu.buildFromTemplate(appTemplate))
}

const checkForUpdate = () => {
  const update = new Update()
  update.check()
}

const addToStartup = () => {
  if (env.name === 'production') {
    const isLinux = ['win32', 'darwin'].indexOf(process.env) !== -1
    if (isLinux) {
      const appLauncher = new AutoLaunch({
        name: 'Zazu App',
      })

      appLauncher.isEnabled().then((enabled) => {
        if (enabled) return
        return appLauncher.enable()
      })
    } else {
      const settings = app.getLoginItemSettings()
      if (!settings.openAtLogin) {
        app.setLoginItemSettings({
          openAtLogin: true,
        })
      }
    }
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

globalEmitter.on('showAbout', (message) => {
  if (aboutWindow) return aboutWindow.focus()
  aboutWindow = new BrowserWindow({
    width: 200,
    height: 200,
    resizable: false,
    title: 'About Zazu',
  })
  aboutWindow.on('closed', () => {
    aboutWindow = null
  })
  aboutWindow.loadURL(path.join('file://', __dirname, '/about.html'))
})

globalEmitter.on('quitApp', () => {
  if (aboutWindow) {
    aboutWindow.close()
    aboutWindow.destroy()
  }
  if (debugWindow) {
    debugWindow.close()
    debugWindow.destroy()
  }
  if (mainWindow) {
    mainWindow.close()
    mainWindow.destroy()
  }
})

globalEmitter.on('showDebug', (message) => {
  if (debugWindow) return debugWindow.focus()
  debugWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: true,
    title: 'Debug Zazu',
  })
  debugWindow.on('closed', () => {
    debugWindow = null
  })
  debugWindow.loadURL(path.join('file://', __dirname, '/debug.html'))
})

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

  configuration.load()
  globalShortcut.register(configuration.hotkey, () => {
    if (mainWindow.isVisible()) {
      globalEmitter.emit('hideWindow')
    } else {
      globalEmitter.emit('showWindow')
    }
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/app.html'))
})

app.on('before-quit', () => {
  globalEmitter.emit('quitApp')
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})
