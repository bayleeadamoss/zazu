import cuid from 'cuid'
import { spawn } from 'child_process'

import Template from '../../lib/template'

export default class UserScript {
  constructor (data) {
    this.id = data && data.id || cuid()
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    const command = this.script.split(' ')[0]
    const args = Template.compile(this.script, {
      value: state.value,
    }).split(' ').slice(1)
    console.log({command, args})
    const cmd = spawn(command, args, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    })

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
        console.log({output, error})
        if (code === 0) { resolve(output) }
        if (code !== 0) { reject(error) }
      })
    })
  }
}
