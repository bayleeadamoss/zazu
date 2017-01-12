const exec = require('child_process').execFile
const which = require('which')
const retry = require('./retry')
const installStatus = require('./installStatus')
const jetpack = require('fs-jetpack')
const mkdirp = require('mkdirp')
const path = require('path')

const git = (args, options) => {
  return new Promise((resolve, reject) => {
    exec(gitPath(), args, options || {}, (err) => {
      err && reject(err) || resolve()
    })
  })
}

const pull = (name, packagePath) => {
  return git(['pull'], { cwd: packagePath }).catch((err) => {
    if (err.message.match(/ENOENT/i)) {
      throw new Error('Package "' + name + '" is not cloned')
    } else {
      throw err
    }
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
 * DUPLICATE COMMENT FOR: github.install
 */
const clone = (name, packagePath) => {
  return installStatus.get(name).then((status) => {
    if (status && jetpack.exists(packagePath)) return status
    return retry(`git clone [${name}]`, () => {
      const packageUrl = 'https://github.com/' + name + '.git'
      return new Promise((resolve, reject) => {
        mkdirp(path.dirname(packagePath), (err) => {
          err ? reject(err) : resolve()
        })
      }).then(() => {
        return git(['clone', packageUrl, packagePath]).catch((err) => {
          if (err.message.match(/already exists/i)) {
            return // futher promises will resolve
          } else if (err.message.match(/Repository not found/i)) {
            throw new Error('Package "' + name + '" does not exist on github')
          } else {
            throw err
          }
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

const gitPath = () => {
  return which.sync('git')
}

const isInstalled = () => {
  try {
    return gitPath()
  } catch (e) {
    return false
  }
}

module.exports = { clone, pull, git, isInstalled }
