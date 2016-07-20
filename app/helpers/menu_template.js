const { BrowserWindow } = require('electron')
const globalEmitter = require('../lib/globalEmitter')
const Update = require('../lib/update')

const menuTemplate = [
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
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
    ],
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
        label: 'Toggle DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: function () {
          BrowserWindow.getFocusedWindow().toggleDevTools()
        },
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Check for updates...',
    click: () => {
      const update = new Update()
      update.check(true)
    },
  },
  { type: 'separator' },
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: () => {
      globalEmitter.emit('quitApp')
    },
  },
]

module.exports = { menuTemplate }
