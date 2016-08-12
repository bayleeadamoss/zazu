const AutoLaunch = require('auto-launch')
const { app } = require('electron')
const env = require('../lib/env')

module.exports = () => {
  if (env.name === 'production') {
    const isLinux = ['win32', 'darwin'].indexOf(process.env) !== -1
    if (isLinux) {
      const appLauncher = new AutoLaunch({
        name: 'Zazu App',
      })

      appLauncher.isEnabled().then((enabled) => {
        if (enabled) return
        return appLauncher.enable()
      })
    } else {
      const settings = app.getLoginItemSettings()
      if (!settings.openAtLogin) {
        app.setLoginItemSettings({
          openAtLogin: true,
        })
      }
    }
  }
}
