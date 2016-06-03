const electron = require('electron')
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {
  on (eventName, listener) {
    super.on(eventName, listener)
    this.ipc.on(eventName, (event, ...args) => {
      listener(...args)
    })
  }
}

class MainEmitter extends MyEmitter {
  constructor () {
    super()
    this.ipc = electron.ipcMain
  }

  emit (eventName, ...args) {
    super.emit(eventName, ...args)
    electron.BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(eventName, ...args)
    })
  }
}

class RendererEmitter extends MyEmitter {
  constructor () {
    super()
    this.ipc = electron.ipcRenderer
  }

  emit (eventName, ...args) {
    super.emit(eventName, ...args)
    this.ipc.send(eventName, ...args)
    const currentWindow = electron.remote.getCurrentWindow()
    electron.remote.BrowserWindow.getAllWindows().forEach((window) => {
      if (window !== currentWindow) {
        window.webContents.send(eventName, ...args)
      }
    })
  }
}

let instance
if (process.type === 'renderer') {
  instance = new RendererEmitter()
} else {
  instance = new MainEmitter()
}
module.exports = instance
