// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from 'electron'
import globalShortcut from 'global-shortcut'
import path from 'path'

import { devMenuTemplate } from './helpers/dev_menu_template'
import { editMenuTemplate } from './helpers/edit_menu_template'
import createWindow from './helpers/window'
import env from './env'

var setApplicationMenu = function () {
  var menus = [editMenuTemplate]
  if (env.name !== 'production') {
    menus.push(devMenuTemplate)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

app.on('ready', function () {
  setApplicationMenu()

  var mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    show: false,
  })

  globalShortcut.register('ctrl+x', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.loadURL(path.join('file://', __dirname, '/app.html'))
})

app.on('window-all-closed', function () {
  app.quit()
})
