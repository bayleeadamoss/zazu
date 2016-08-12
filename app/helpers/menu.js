const { app, BrowserWindow, dialog, Menu, systemPreferences, Tray } = require('electron')
const path = require('path')

const globalEmitter = require('../lib/globalEmitter')
const Update = require('../lib/update')

const openDevTools = () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (currentWindow) {
    if (currentWindow.isDevToolsOpened()) {
      currentWindow.closeDevTools()
    }
    currentWindow.openDevTools({
      mode: 'undocked',
    })
  } else {
    dialog.showMessageBox({
      type: 'error',
      message: 'No focused window',
      detail: 'There are currently no focused windows.',
      buttons: ['Ok'],
    })
  }
}

const appTemplate = [
  {
    label: 'Zazu',
    submenu: [
      { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
      { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
      {
        label: 'Toggle Chrome DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: openDevTools,
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  },
]

const trayTemplate = [
  {
    label: 'Toggle Zazu',
    click () {
      globalEmitter.emit('toggleWindow')
    },
  },
  { type: 'separator' },
  {
    label: 'About Zazu',
    click () {
      globalEmitter.emit('showAbout')
    },
  },
  { type: 'separator' },
  {
    label: 'Development',
    submenu: [
      {
        label: 'Zazu Plugin Debugger',
        click () {
          globalEmitter.emit('showDebug')
        },
      },
      {
        label: 'Chrome DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: openDevTools,
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Check for Zazu Updates',
    click: () => {
      const update = new Update()
      update.check(true)
    },
  },
  {
    label: 'Update installed Plugins',
    click: () => {
      globalEmitter.emit('updatePlugins')
    },
  },
  { type: 'separator' },
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: () => {
      app.quit()
    },
  },
]

let tray
module.exports = () => {
  if (app.dock) app.dock.hide()
  const iconName = systemPreferences.isDarkMode() ? 'tray-icon-white.png' : 'tray-icon.png'
  const iconPath = path.join(app.getAppPath(), 'assets', 'images', iconName)
  tray = new Tray(iconPath)
  tray.setToolTip('Toggle Zazu')
  tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
  Menu.setApplicationMenu(Menu.buildFromTemplate(appTemplate))
}
