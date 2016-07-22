const path = require('path')
const npm = require('npm')
const jetpack = require('fs-jetpack')

const npmInstall = (baseDir) => {
  const packageFile = path.join(baseDir, 'package.json')
  if (!jetpack.exists(packageFile)) {
    return Promise.resolve()
  }
  const pkg = require(packageFile)
  const packages = Object.keys(pkg.dependencies).map((packageName) => {
    const packageVersion = pkg.dependencies[packageName]
    return packageName + '@' + packageVersion
  })
  return new Promise((resolve, reject) => {
    npm.load({}, (npmEr) => {
      if (npmEr) return reject(npmEr)
      npm.commands.install(baseDir, packages, resolve)
    })
  })
}

module.exports = npmInstall
