const electron = require('electron')

const configuration = require('../lib/configuration')

class Screens {
  constructor (options) {
    this.screenModule = electron.screen
    this.displayOn = configuration.displayOn
    if (this.displayOn === 'detect') {
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

  saveWindowPositionOnCurrentScreen (currentWindowPositionX, currentWindowPositionY, flag) {
    if (this.displayOn === 'detect') {
      let currentDisplay = this.getCurrentScreen()
      if (currentDisplay.id === this.screenModule.getDisplayNearestPoint({x: currentWindowPositionX, y: currentWindowPositionY}).id) {
        // save previous position
        if (currentDisplay.customPosition) {
          currentDisplay.lastPosition = currentDisplay.customPosition
        }
        currentDisplay.customPosition = {
          x: currentWindowPositionX,
          y: currentWindowPositionY,
          time: Date.now(),
        }
      } else {
        let timeDiff = (Date.now() - currentDisplay.customPosition.time)
        // if second move event fired in quick succession
        if (timeDiff < 50) {
          // replace current position with last to fix linux duplicate 'move' event bug
          currentDisplay.customPosition = currentDisplay.lastPosition
        }
      }
    }
  }

  getCenterPositionOnCurrentScreen () {
    if (this.displayOn === 'detect') {
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
