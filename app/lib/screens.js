// FIXING THIS
/*
  Figured out that there's a position saving issue when Zazu is open on one screen
and then the user tries to close it when the mouse is on a different screen.

Trying to fix this by comparing the screen on which the window is and the screen where the mouse is on save
If on save there is a difference, do not proceed with updating customPosition
*/

const electron = require('electron')

const configuration = require('../lib/configuration')

const primaryMonitor = !!configuration.primaryMonitor

class Screens {
  constructor (windowWidth) {
    this.screenModule = electron.screen
    if (!primaryMonitor) {
      this.resetScreens(windowWidth)
    }
    this.screenModule.on('display-added', () => {
      this.resetScreens(windowWidth)
    })
    this.screenModule.on('display-removed', () => {
      this.resetScreens(windowWidth)
    })
    this.screenModule.on('display-metrics-changed', () => {
      this.resetScreens(windowWidth)
    })
  }

  saveWindowPositionOnCurrentScreen (currentWindowPositionX, currentWindowPositionY) {
    if (!primaryMonitor) {
      let currentDisplay = this.getDisplayBelowCursor()
      if (currentDisplay.id === this.screenModule.getDisplayNearestPoint(currentWindowPositionX, currentWindowPositionY).id) {
        this.screens[currentDisplay.id].customPosition = {
          x: currentWindowPositionX,
          y: currentWindowPositionY,
        }
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
