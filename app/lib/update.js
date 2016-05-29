const semver = require('semver')
const https = require('https')
const { app } = require('electron')

class Update {

  constructor () {
    this._latestVersion = null
  }

  needsUpdate () {
    return this.latestVersion().then((newestVersion) => {
      return semver.satisfies(newestVersion, `>${app.getVersion()}`) && newestVersion
    })
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
          resolve(this._latestVersion)
        })
      }).on('error', (e) => {
        reject(`Got error: ${e.message}`)
      })
    })
  }

}

module.exports = Update
