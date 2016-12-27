const semver = require('semver')
const json = require('./json')
const { shell, app, dialog } = require('electron')

const globalEmitter = require('./globalEmitter')
const logger = require('./logger')

var self = {

  _latestVersion: null,

  queueUpdate () {
    const tenMinutes = 1000 * 60 * 10
    setTimeout(() => {
      self.check()
    }, tenMinutes)
  },

  latestVersion () {
    return new Promise((resolve, reject) => {
      if (self._latestVersion) {
        return resolve(self._latestVersion)
      }
      json({
        host: 'api.github.com',
        path: '/repos/tinytacoteam/zazu/releases/latest',
      }).then((body) => {
        resolve(body.tag_name || app.getVersion())
      }).catch((e) => {
        reject(`Got error: ${e.message}`)
      })
    })
  },

  needsUpdate () {
    return self.latestVersion().then((newestVersion) => {
      return semver.satisfies(newestVersion, `>${app.getVersion()}`) && newestVersion
    })
  },

  check (manualUpdate) {
    self.needsUpdate().then((updateVersion) => {
      if (updateVersion) {
        logger.log('info', 'needs zazu software update', { updateVersion })
        globalEmitter.emit('showWindow')
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Ignore', 'Download'],
          defaultId: 1,
          cancelId: 0,
          title: 'Zazu Updater',
          message: 'Zazu ' + updateVersion + ' is available for download!',
          detail: 'Click download to get the newest version of Zazu!',
        }, (response) => {
          if (response === 1) {
            shell.openExternal('http://zazuapp.org/')
          }
        })
      } else if (manualUpdate) {
        dialog.showMessageBox({
          type: 'none',
          title: 'Zazu Updater',
          message: 'Your Zazu version is up to date!',
          detail: 'No Zazu Updates were found.',
          buttons: [],
        })
      }
    })
  },

}

module.exports = self
