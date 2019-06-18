const { After, Before } = require('cucumber')
const jetpack = require('fs-jetpack')
const path = require('path')
const { git } = require('../../app/lib/git')

const homeDir = path.join(__dirname, '../../test/fixtures/home')
const calcPlugin = path.join(homeDir, '.zazu', 'plugins', 'tinytacoteam', 'zazu-calculator')
const fallbackPlugin = path.join(homeDir, '.zazu', 'plugins', 'tinytacoteam', 'zazu-fallback')
const databaseFile = path.join(homeDir, '.zazu', 'databases', 'installStatus.nedb')
const configFile = path.join(homeDir, '.zazurc.json')

Before(function () {
  return git(['checkout', configFile]).then(() => {
    jetpack.remove(calcPlugin)
    jetpack.remove(fallbackPlugin)
    return this.close()
  }).then(() => {
    return git(['checkout', databaseFile])
  }).then(() => {
    const logDir = path.join(homeDir, '.zazu/log')
    const files = jetpack.list(logDir) || []
    return files.map((file) => {
      const logFile = path.join(logDir, file)
      jetpack.remove(logFile)
    })
  })
})

After(function (testCase) {
  return this.close().then(() => {
    return git(['checkout', databaseFile])
  }).then(() => {
    return git(['checkout', configFile])
  })
})
