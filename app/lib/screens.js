const electron = require('electron')

const configuration = require('../lib/configuration')

const primaryMonitor = !!configuration.primaryMonitor

class Screens {
  constructor () {
    this.screenModule = electron.screen
    this.screens = {}

    if (!primaryMonitor) {
      this.screenModule.getAllDisplays().forEach((display) => {
        this.screens[display.id] = display
      })
    }
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

  getCenterPositionOnCurrentScreen (windowWidth, windowMaxHeight) {
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
        centerPosition.y = Math.ceil(((currentScreen.bounds.y + (currentScreen.bounds.height / 2)) - (windowMaxHeight / 2)))
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
}

module.exports = Screens
