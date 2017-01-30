const electron = require('electron')

const configuration = require('../lib/configuration')

const primaryMonitor = !!configuration.primaryMonitor

class Screens {
  constructor (options) {
    this.screenModule = electron.screen
    if (!primaryMonitor) {
      this.resetScreens(options.windowWidth)
    }
    this.screenModule.on('display-added', () => {
      this.resetScreens(options.windowWidth)
    })
    this.screenModule.on('display-removed', () => {
      this.resetScreens(options.windowWidth)
    })
    this.screenModule.on('display-metrics-changed', () => {
      this.resetScreens(options.windowWidth)
    })
  }

  saveWindowPositionOnCurrentScreen (currentWindowPositionX, currentWindowPositionY) {
    if (!primaryMonitor) {
      let currentDisplay = this.getDisplayBelowCursor()
      if (currentDisplay.id === this.screenModule.getDisplayNearestPoint({x: currentWindowPositionX, y: currentWindowPositionY}).id) {
        this.screens[currentDisplay.id].customPosition = {
          x: currentWindowPositionX,
          y: currentWindowPositionY,
        }
    }
  }

  getCenterPositionOnCurrentScreen () {
    if (!primaryMonitor) {
      let currentScreen = this.getCurrentScreen()
      let centerPosition = {
        x: currentScreen.customPosition.x,
        y: currentScreen.customPosition.y,
      }
      return centerPosition
    }
    return null
  }

  getDisplayBelowCursor () {
    return this.screenModule.getDisplayNearestPoint(this.screenModule.getCursorScreenPoint())
  }

  getCurrentScreen () {
    return this.screens[this.getDisplayBelowCursor().id]
  }

  getAllScreens () {
    return this.screens
  }

  resetScreens (windowWidth) {
    this.screens = {}
    this.screenModule.getAllDisplays().forEach((display) => {
      this.screens[display.id] = display
      this.screens[display.id].customPosition = {
        x: Math.ceil(((display.bounds.x + (display.bounds.width / 2)) - (windowWidth / 2))),
        y: Math.ceil(display.bounds.y + (display.bounds.height * 0.33)),
      }
    })
  }
}

module.exports = Screens
