const path = require('path')
const jetpack = require('fs-jetpack')
const retry = require('./retry')
const installStatus = require('./installStatus')
const { cooldown } = require('./manager')
const freshRequire = require('./pluginFreshRequire')

/**
 * If successful, will set the `installStatus` to `installed` and return it, to
 * communicate to `git clone` that we were successful and don't need to run
 * again, until a `git pull`.
 *
 * On failure, returns a rejected promise, so `retry` runs it again.
 */
const npmInstall = cooldown((name, packagePath) => {
  return retry(`npm install [${name}]`, () => {
    const packageFile = path.join(packagePath, 'package.json')
    if (!jetpack.exists(packageFile)) {
      return installStatus.set(name, 'nopackage')
    }
    const pkg = require(packageFile)
    const dependencies = pkg.dependencies
    if (!dependencies) {
      return installStatus.set(name, 'nodeps')
    }
    const packages = Object.keys(dependencies).map((packageName) => {
      const packageVersion = dependencies[packageName]
      return packageName + '@' + packageVersion
    })
    return new Promise((resolve, reject) => {
      const npm = require('npm')
      npm.load({ production: true, optional: false, audit: false, 'strict-ssl': false }, npmErr => {
        if (npmErr) return reject(npmErr)
        npm.commands.install(packagePath, packages, err => {
          if (err) return reject(err)
          installStatus.set(name, 'installed').then(resolve)
        })
      })
    })
  })
}, () => {
  return freshRequire('npm')
})

module.exports = npmInstall
