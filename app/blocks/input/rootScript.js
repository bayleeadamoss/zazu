const Process = require('../../lib/process')
const Template = require('../../lib/template')
const InputBlock = require('../inputBlock')

class RootScript extends InputBlock {
  constructor (data) {
    super(data)
    this.script = data.script
    this.userRespondsTo = data.respondsTo
    this.cwd = data.cwd
  }

  respondsTo (input) {
    return this.active() && this.userRespondsTo(input)
  }

  search (query, env = {}) {
    if (this.lastProcess) {
      this.lastProcess.cancel()
    }
    const script = Template.compile(this.script, {
      query,
    })

    this.lastProcess = Process.execute(script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    }).then((results) => {
      return JSON.parse(results)
    })
    return this.lastProcess
  }
}

module.exports = RootScript
