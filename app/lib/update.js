const semver = require('semver')
const https = require('https')
const { shell, app, dialog } = require('electron')

const globalEmitter = require('./globalEmitter')

class Update {

  constructor () {
    this._latestVersion = null
  }

  latestVersion () {
    return new Promise((resolve, reject) => {
      if (this._latestVersion) {
        return resolve(this._latestVersion)
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
          this._latestVersion = JSON.parse(chunks.join()).tag_name
          resolve(this._latestVersion || app.getVersion())
        })
      }).on('error', (e) => {
        reject(`Got error: ${e.message}`)
      })
    })
  }

  needsUpdate () {
    return this.latestVersion().then((newestVersion) => {
      return semver.satisfies(newestVersion, `>${app.getVersion()}`) && newestVersion
    })
  }

  check (manualUpdate) {
    this.needsUpdate().then((updateVersion) => {
      if (updateVersion) {
        globalEmitter.emit('showWindow')
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Ignore', 'Download'],
          defaultId: 1,
          cancelId: 0,
          title: 'Zazu Updater',
          message: 'Zazu v' + updateVersion + ' is available for download!',
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
  }

}

module.exports = Update
