const request = require('request')
const path = require('path')
const fs = require('fs')
const json = require('./json')
const jetpack = require('fs-jetpack')
const decompress = require('decompress')
const mkdirp = require('mkdirp')
const retry = require('./retry')
const installStatus = require('./installStatus')

const currentRemoteVersion = (name) => {
  return json({
    https: true,
    host: 'api.github.com',
    path: '/repos/' + name + '/commits',
  }).then((response) => {
    return response[0] && response[0].sha || 'master'
  })
}

const currentLocalVersion = (packagePath) => {
  const versionPath = path.join(packagePath, '.head.zazu.')
  return new Promise((resolve, reject) => {
    fs.readFile(versionPath, (_, data) => {
      resolve(data || '')
    })
  })
}

const pull = (name, packagePath) => {
  const versions = [currentRemoteVersion(name), currentLocalVersion(packagePath)]
  return Promise.all(versions).then(([remoteVersion, localVersion]) => {
    if (remoteVersion === localVersion) return
    return jetpack.removeAsync(packagePath).then(() => {
      return clone(name, packagePath)
    })
  })
}

const download = (remote, local) => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(local), (err) => {
      err ? reject(err) : resolve()
    })
  }).then(() => {
    return new Promise((resolve, reject) => {
      request(remote)
        .pipe(fs.createWriteStream(local))
        .on('close', () => {
          resolve()
        })
    })
  })
}

/**
 * Checks the status to see what work needs to be done. If the status is
 * `cloned` it succesfully cloned the repo, but didn't `npm install`. If the
 * status is `installed` there is no more work to do. If no status exists, we
 * clone the repo.
 *
 * Failures will `retry` the clone.
 *
 * DUPLICATE COMMENT FOR: git.install
 */
const clone = (name, packagePath) => {
  return installStatus.get(name).then((status) => {
    if (status && jetpack.exists(packagePath)) return status
    return retry(`github clone [${name}]`, () => {
      return currentRemoteVersion(name).then((version) => {
        const zipUrl = `https://github.com/${name}/archive/${version}.zip`
        const packageName = name.split('/')[1]
        const extractDir = path.join(packagePath, '..')
        const extractPath = path.join(extractDir, `${packageName}-${version}`)
        const tempPath = path.join(extractDir, `${packageName}-${version}.zip`)
        const versionPath = path.join(packagePath, '.head.zazu.')
        return download(zipUrl, tempPath).then(() => {
          return decompress(tempPath, extractDir)
        }).then(() => {
          return jetpack.removeAsync(tempPath)
        }).then(() => {
          return jetpack.renameAsync(extractPath, packageName)
        }).then(() => {
          return jetpack.writeAsync(versionPath, version)
        })
      }).then(() => {
        return installStatus.set(name, 'cloned')
      })
    }, {
      clean: () => {
        return jetpack.removeAsync(packagePath)
      },
    })
  })
}

const isInstalled = () => {
  return true
}

module.exports = { clone, pull, isInstalled }
