const electron = require('electron')
const configuration = require('../lib/configuration')

class Screens {
  static getInstance (options) {
    if (configuration.displayOn !== 'detect') {
      return new PrimaryScreens(options)
    }
    return new DetectScreens(options)
  }
}

class PrimaryScreens {
  saveWindowPositionOnCurrentScreen () {}
  getCenterPositionOnCurrentScreen () {}
}

class DetectScreens {
  constructor ({ windowWidth }) {
    this.windowWidth = windowWidth
    this.initialized = false
  }

  monitorDisplays () {
    if (this.initialized) return
    this.initialized = true
    this.positions = {}
    this.screenModule = electron.screen
    this.screenModule.on('display-added', () => {
      this.positions = {}
    })
    this.screenModule.on('display-removed', () => {
      this.positions = {}
    })
    this.screenModule.on('display-metrics-changed', () => {
      this.positions = {}
    })
  }

  getCurrentScreen () {
    const point = this.screenModule.getCursorScreenPoint()
    return this.screenModule.getDisplayNearestPoint(point)
  }

  saveWindowPositionOnCurrentScreen (positionX, positionY) {
    const currentScreen = this.getCurrentScreen()
    const closestScreen = this.screenModule.getDisplayNearestPoint({
      x: positionX,
      y: positionY,
    })
    this.positions[currentScreen.id] = this.positions[currentScreen.id] || {}
    const position = this.positions[currentScreen.id]

    if (currentScreen.id === closestScreen.id) {
      if (position.customPosition) {
        position.lastPosition = position.customPosition
      }
      position.customPosition = {
        x: positionX,
        y: positionY,
        time: Date.now(),
      }
    } else if (position.customPosition && position.lastPosition) {
      const timeDiff = (Date.now() - position.customPosition.time)
      if (timeDiff < 50) {
        // if second move event fired in quick succession then replace the
        // current position with last to fix linux duplicate 'move' event bug
        position.customPosition = position.lastPosition
      }
    }
  }

  getCenterPositionOnCurrentScreen () {
    this.monitorDisplays()
    const currentScreen = this.getCurrentScreen()
    const position = this.positions[currentScreen.id] || {}
    if (position.customPosition) {
      return {
        x: position.customPosition.x,
        y: position.customPosition.y,
      }
    }
    return {
      x: Math.ceil(((currentScreen.bounds.x + (currentScreen.bounds.width / 2)) - (this.windowWidth / 2))),
      y: Math.ceil(currentScreen.bounds.y + (currentScreen.bounds.height * 0.33)),
    }
  }
}

module.exports = Screens
