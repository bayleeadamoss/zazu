const { app, clipboard, dialog } = require('electron')
const env = require('./lib/env')

const items = [
  { name: 'App Environment', value: env.name },
  { name: 'App Version', value: app.getVersion() },
  { name: 'Electron Version', value: process.versions.electron },
  { name: 'Node Version', value: process.versions.node },
  { name: 'Chrome Version', value: process.versions.chrome },
]

module.exports = {
  show () {
    const detail = items.map((item) => {
      return item.name + ': ' + item.value
    }).join('\n')
    dialog.showMessageBox({
      type: 'info',
      message: 'Zazu App',
      detail,
      defaultId: 0,
      buttons: ['Ok', 'Copy'],
    }, (index) => {
      if (index === 1) {
        clipboard.writeText(detail)
      }
    })
  },
}
