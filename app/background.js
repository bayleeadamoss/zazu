// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

const { app, Menu, dialog, shell, Tray, systemPreferences } = require('electron')
const globalShortcut = require('global-shortcut')
const path = require('path')

const { menuTemplate } = require('./helpers/menu_template')
const { windowHelper } = require('./helpers/window')
const configuration = require('./configuration')
const Update = require('./lib/update')
const globalEmitter = require('./lib/globalEmitter')

let mainWindow, tray

const setApplicationMenu = () => {
  if (app.dock) app.dock.hide()
  const iconName = systemPreferences.isDarkMode() ? 'tray-icon-white.png' : 'tray-icon.png'
  const iconPath = path.join(app.getAppPath(), 'images', iconName)
  tray = new Tray(iconPath)
  tray.setToolTip('Toggle Zazu')
  tray.setContextMenu(Menu.buildFromTemplate(menuTemplate))
}

const checkUpdate = () => {
  const update = new Update()
  update.needsUpdate().then((newerVersion) => {
    if (!newerVersion) { return }
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Ignore', 'Download'],
      defaultId: 1,
      cancelId: 0,
      title: 'Newer version available!',
      message: `Zazu ${newerVersion} is available for download!`,
      detail: 'Click download to get the newest version of Zazu!',
    }, (response) => {
      if (response === 1) {
        shell.openExternal('http://zazuapp.org/')
      }
    })
  })
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

  checkUpdate()

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
