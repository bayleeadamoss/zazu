const request = require('request')
const path = require('path')
const fs = require('fs')
const json = require('./json')
const jetpack = require('fs-jetpack')
const decompress = require('decompress')
const mkdirp = require('mkdirp')

const currentRemoteVersion = (name) => {
  return json({
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
    const dir = path.dirname(local)
    if (!fs.existsSync(dir)) {
      mkdirp(dir, resolve)
    } else {
      resolve()
    }
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

const clone = (name, packagePath) => {
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
  })
}

const isInstalled = () => {
  return true
}

module.exports = { clone, pull, isInstalled }
