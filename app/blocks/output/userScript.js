const cuid = require('cuid')

const Process = require('../../lib/process')
const Template = require('../../lib/template')

class UserScript {
  constructor (data) {
    this.id = data && data.id || cuid()
    this.script = data.script
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    const script = Template.compile(this.script, {
      value: state.value,
    })

    return Process.execute(script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    })
  }
}

module.exports = UserScript
