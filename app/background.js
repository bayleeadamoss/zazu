// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, ipcMain, dialog, shell } from 'electron'
import globalShortcut from 'global-shortcut'
import path from 'path'

import { devMenuTemplate } from './helpers/dev_menu_template'
import { editMenuTemplate } from './helpers/edit_menu_template'
import { windowHelper } from './helpers/window'
import env from './env'
import configuration from './configuration'
import Update from './lib/update'

let mainWindow

var setApplicationMenu = function () {
  var menus = [editMenuTemplate]
  if (env.name !== 'production') {
    menus.push(devMenuTemplate)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
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

  // mainWindow.webContents.toggleDevTools();

  ipcMain.on('message', (_, message) => {
    console.log('message:', message)
  })

  ipcMain.on('hideWindow', (_, error) => {
    mainWindow.hide()
  })

  mainWindow.on('blur', () => {
    mainWindow.hide()
  })

  configuration.load().then(() => {
    globalShortcut.register(configuration.hotkey, () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
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
