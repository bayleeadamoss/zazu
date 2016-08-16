const AutoLaunch = require('auto-launch')
const { app } = require('electron')
const env = require('../lib/env')
const logger = require('../lib/logger')

module.exports = () => {
  if (env.name === 'production') {
    const isLinux = ['win32', 'darwin'].indexOf(process.env) !== -1
    if (isLinux) {
      const appLauncher = new AutoLaunch({
        name: 'Zazu App',
      })

      appLauncher.isEnabled().then((enabled) => {
        if (enabled) return
        logger.log('info', 'Adding to linux startup')
        return appLauncher.enable()
      })
    } else {
      const settings = app.getLoginItemSettings()
      if (!settings.openAtLogin) {
        logger.log('info', 'Adding to win32 or darwin startup')
        app.setLoginItemSettings({
          openAtLogin: true,
        })
      }
    }
  }
}
