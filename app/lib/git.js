const exec = require('child_process').execFile
const which = require('which')

const git = (args, options) => {
  return new Promise((resolve, reject) => {
    which('git', (err, resolvedPath) => {
      if (err) return reject('GIT was not found on  your system')
      exec(resolvedPath, args, options || {}, (err) => {
        err && reject(err) || resolve()
      })
    })
  })
}

const pull = (packagePath) => {
  return git(['pull'], { cwd: packagePath }).catch((err) => {
    if (err.message.match(/ENOENT/i)) {
      throw new Error('Package "' + name + '" is not cloneed')
    } else {
      throw err
    }
  })
}

const clone = (name, packagePath) => {
  const packageUrl = 'git@github.com:' + name + '.git'
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

module.exports = { clone, pull, git }
