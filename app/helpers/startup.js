const AutoLaunch = require('auto-launch')
const Datastore = require('nestdb')
const { app } = require('electron')
const path = require('path')
const env = require('../lib/env')
const logger = require('../lib/logger')

const alreadyAddedToStartup = (database) => {
  return new Promise((resolve, reject) => {
    database.find({ key: 'addedToStartup' }).exec((err, docs) => {
      if (err) reject(err)
      resolve(docs.length > 0)
    })
  })
}

const markAddedToStartup = (database) => {
  return new Promise((resolve, reject) => {
    database.insert({ key: 'addedToStartup', value: true }, (err) => {
      err ? reject(err) : resolve()
    })
  })
}

const addToStartup = () => {
  const isLinux = ['win32', 'darwin'].indexOf(process.platform) === -1
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

module.exports = (configuration) => {
  if (env.name !== 'production') return
  const databasePath = path.join(configuration.databaseDir, 'settings.nedb')
  const database = new Datastore({ filename: databasePath, autoload: true })
  return alreadyAddedToStartup(database).then((value) => {
    if (value) return
    return markAddedToStartup(database).then(addToStartup)
  })
}
