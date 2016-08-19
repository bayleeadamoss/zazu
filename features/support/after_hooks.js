const jetpack = require('fs-jetpack')
const path = require('path')
const { git } = require('../../app/lib/git')

module.exports = function () {
  this.Before(function () {
    const homeDir = path.join(__dirname, '../../test/fixtures/home')
    const calcPlugin = path.join(homeDir, '.zazu', 'plugins', 'tinytacoteam', 'zazu-calculator')
    const fallbackPlugin = path.join(homeDir, '.zazu', 'plugins', 'tinytacoteam', 'zazu-fallback')
    const configFile = path.join(homeDir, '.zazurc.js')
    return git(['checkout', configFile]).then(() => {
      jetpack.remove(calcPlugin)
      jetpack.remove(fallbackPlugin)
      return this.close()
    }).then(() => {
      const logDir = path.join(homeDir, '.zazu/log')
      const files = jetpack.list(logDir) || []
      return files.map((file) => {
        const logFile = path.join(logDir, file)
        jetpack.remove(logFile)
      })
    })
  })

  this.After(function (scenario) {
    return this.close().then(() => {
      if (scenario.isFailed()) {
        const homeDir = path.join(__dirname, '../../test/fixtures/home')
        const logDir = path.join(homeDir, '.zazu/log')
        const files = jetpack.list(logDir) || []
        files.map((file) => {
          const logFile = path.join(logDir, file)
          console.log(jetpack.read(logFile))
        })
      }
    })
  })
}
