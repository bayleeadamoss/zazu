const { app } = require('electron')
const globalEmitter = require('../lib/globalEmitter')

module.exports = () => {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    globalEmitter.emit('showWindow')
  }
}
