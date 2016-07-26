// Simple module exposes environment variables to rest of the code.

const jetpack = require('fs-jetpack')

var env
if (process.env.NODE_ENV) {
  env = {
    name: 'test',
  }
} else {
  var app
  if (process.type === 'renderer') {
    app = require('electron').remote.app
  } else {
    app = require('electron').app
  }
  var appDir = jetpack.cwd(app.getAppPath())

  env = appDir.read('package.json', 'json').env
}

module.exports = env
