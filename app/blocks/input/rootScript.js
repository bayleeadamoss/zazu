import { spawn } from 'child_process'
import cuid from 'cuid'

/**
 * Runs a script without any prefix.
 *
 * ## Attributes
 *
 * - `script`: Required. The command line script to run.
 * - `connections`: Required. The block ids next in the workflow.
 * - `respondsTo`: Required. A preliminary function to determine if this plugin
 *                 can handle the given input or not.
 *
 * ## Example
 *
 * ~~~
 * {
 *   id: 1,
 *   type: "RootScript",
 *   script: "node findApps.js {query}",
 *   respondsTo: (input) => {
 *     return input.match(/[a-z]/i)
 *   },
 *   connections: [2],
 * }
 * ~~~
 */
export default class RootScript {
  constructor (data) {
    this.id = data.id || cuid()
    this.script = data.script
    this.respondsTo = data.respondsTo
    this.connections = data.connections
    this.cwd = data.cwd
  }

  call (input) {
    const command = this.script.split(' ')[0]
    const args = this.script
      .replace('{query}', input)
      .split(' ')
      .slice(1)
    const cmd = spawn(command, args, {
      cwd: this.cwd,
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
        if (code === 0) { resolve(JSON.parse(output)) }
        if (code !== 0) { reject(error) }
      })
    })
  }
}
