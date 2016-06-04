const Promise = require('bluebird')
const { exec } = require('child_process')

Promise.config({
  cancellation: true,
})

class Process {
  static execute (script, options = {}) {
    return new Promise((resolve, reject, onCancel) => {
      const cmd = exec(script, (error, stdout, stderr) => {
        if (error) {
          reject(stderr)
        } else {
          resolve(stdout)
        }
      })

      onCancel(() => {
        cmd.kill('SIGKILL')
      })
    })
  }
}

module.exports = Process
