const exec = require('child_process').execFile
const which = require('which')

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

const clone = (name, packagePath) => {
  const packageUrl = 'https://github.com/' + name + '.git'
  return git(['clone', packageUrl, packagePath]).catch((err) => {
    if (err.message.match(/already exists/i)) {
      return // futher promises will resolve
    } else if (err.message.match(/Repository not found/i)) {
      throw new Error('Package "' + name + '" does not exist on github')
    } else {
      throw err
    }
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
