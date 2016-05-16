import { spawn } from 'child_process'

export default class Process {
  static execute (script, options = {}) {
    script = script.split(' ')
    const command = script[0]
    const args = script.slice(1)
    const cmd = spawn(command, args, options)
    return new Promise((resolve, reject) => {
      let output = ''
      let error = ''

      cmd.stdout.on('data', (data) => {
        output += data
      })

      cmd.stderr.on('data', (data) => {
        error += data
      })

      cmd.on('close', (code) => {
        if (code === 0) { resolve(output) }
        if (code !== 0) { reject(error) }
      })
    })
  }
}
