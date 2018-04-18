const { app, BrowserWindow, dialog, Menu, Tray } = require('electron')
const path = require('path')

const configuration = require('../lib/configuration')
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
      defaultId: 0,
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
        label: 'Plugin Debugger',
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
    label: 'Check for Updates',
    click: () => {
      Update.check(true)
    },
  },
  {
    label: 'Update Plugins',
    click: () => {
      globalEmitter.emit('updatePlugins')
    },
  },
  {
    label: 'Reload Config',
    click: () => {
      globalEmitter.emit('reloadConfig')
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
module.exports = {
  createMenu: () => {
    if (app.dock) app.dock.hide()
    if (!configuration.hideTrayItem) {
      const iconPath = path.join(app.getAppPath(), 'assets', 'images', 'iconTemplate.png')
      tray = new Tray(iconPath)
      tray.setToolTip('Toggle Zazu')
      tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(appTemplate))
  },
  menuTemplate: trayTemplate,
}
