const path = require('path')
const npm = require('npm')
const jetpack = require('fs-jetpack')

const npmInstall = (baseDir) => {
  const packageFile = path.join(baseDir, 'package.json')
  if (!jetpack.exists(packageFile)) {
    return Promise.resolve()
  }
  const pkg = require(packageFile)
  const dependencies = pkg.dependencies
  if (!dependencies) {
    return Promise.resolve()
  }
  const packages = Object.keys(dependencies).map((packageName) => {
    const packageVersion = dependencies[packageName]
    return packageName + '@' + packageVersion
  })
  return new Promise((resolve, reject) => {
    npm.load({}, (npmEr) => {
      if (npmEr) return reject(npmEr)
      npm.commands.install(baseDir, packages, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  })
}

module.exports = npmInstall
