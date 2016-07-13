const GhReleases = require('electron-gh-releases')
const { shell, app, dialog } = require('electron')

class Update {

  constructor () {
    this.updater = new GhReleases({
      repo: 'tinytacoteam/zazu',
      currentVersion: app.getVersion(),
    })
    this.updater.on('update-downloaded', (info) => {
      this.updater.install()
    })
  }

  check (manualUpdate) {
    this.updater.check((err, hasUpdate) => {
      if (hasUpdate) {
        dialog.showMessageBox({
          type: 'question',
          buttons: ['Ignore', 'Download'],
          defaultId: 1,
          cancelId: 0,
          title: 'Newer version available!',
          message: 'A new Zazu is available for download!',
          detail: 'Click download to get the newest version of Zazu!',
        }, (response) => {
          if (response === 1) {
            if (err) {
              shell.openExternal('http://zazuapp.org/') // linux
            } else {
              this.updater.download() // mac or windows
            }
          }
        })
      } else if (manualUpdate) {
        dialog.showMessageBox({
          type: 'none',
          title: 'Zazu Updater',
          detail: 'No Zazu Updates were found.',
          buttons: [],
        })
      }
    })
  }

}

module.exports = Update
