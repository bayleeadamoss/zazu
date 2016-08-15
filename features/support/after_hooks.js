const jetpack = require('fs-jetpack')
const path = require('path')
const { git } = require('../../app/lib/git')

module.exports = function () {
  this.Before(function (scenario) {
    const homeDir = path.join(__dirname, '../../test/fixtures/home')
    const calcPlugin = path.join(homeDir, '.zazu', 'plugins', 'tinytacoteam', 'zazu-calculator')
    const configFile = path.join(__dirname, '..', '..', 'test', 'fixtures', 'home', '.zazurc.js')
    return git(['checkout', configFile]).then(() => {
      jetpack.remove(calcPlugin)
      return this.close()
    })
  })

  this.After(function (scenario) {
    return this.close()
  })
}
