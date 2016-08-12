const semver = require('semver')
const https = require('https')
const { shell, app, dialog } = require('electron')

const globalEmitter = require('./globalEmitter')

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
      https.get({
        host: 'api.github.com',
        path: '/repos/tinytacoteam/zazu/releases/latest',
        headers: {
          'User-Agent': `ZazuApp Updater v${app.getVersion()}`,
        },
      }, (res) => {
        var chunks = []
        res.on('data', (chunk) => {
          chunks.push(chunk.toString())
        })
        res.on('end', () => {
          self._latestVersion = JSON.parse(chunks.join()).tag_name
          resolve(self._latestVersion || app.getVersion())
        })
      }).on('error', (e) => {
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
