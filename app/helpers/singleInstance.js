const { app } = require('electron')
const globalEmitter = require('../lib/globalEmitter')

module.exports = () => {
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    globalEmitter.emit('showWindow')
  })

  if (shouldQuit) {
    app.quit()
  }
}
