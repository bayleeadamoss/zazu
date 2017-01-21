const electron = require('electron')

const configuration = require('../lib/configuration')

const primaryMonitor = !!configuration.primaryMonitor

class Screens {
  constructor () {
    this.screenModule = electron.screen
    if (!primaryMonitor) {
      this.resetScreens()
    }
    this.screenModule.on('display-added', () => {
      this.resetScreens()
    })
    this.screenModule.on('display-removed', () => {
      this.resetScreens()
    })
    this.screenModule.on('display-metrics-changed', () => {
      this.resetScreens()
    })
  }

  saveWindowPositionOnCurrentScreen (currentWindowPositionX, currentWindowPositionY) {
    if (!primaryMonitor) {
      let currentDisplay = this.getDisplayBelowCursor()
      this.screens[currentDisplay.id].customPosition = {
        x: currentWindowPositionX,
        y: currentWindowPositionY,
      }
    }
  }

  getCenterPositionOnCurrentScreen (windowWidth) {
    if (!primaryMonitor) {
      let currentScreen = this.getCurrentScreen()
      let centerPosition = {
        x: 0,
        y: 0,
      }
      if (currentScreen.customPosition) {
        centerPosition.x = currentScreen.customPosition.x
        centerPosition.y = currentScreen.customPosition.y
      } else {
        centerPosition.x = Math.ceil(((currentScreen.bounds.x + (currentScreen.bounds.width / 2)) - (windowWidth / 2)))
        centerPosition.y = Math.ceil(currentScreen.bounds.y + (currentScreen.bounds.height * 0.33))
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

  resetScreens () {
    this.screens = {}
    this.screenModule.getAllDisplays().forEach((display) => {
      this.screens[display.id] = display
    })
  }
}

module.exports = Screens
