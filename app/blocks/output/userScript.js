const Process = require('../../lib/process')
const Template = require('../../lib/template')
const Block = require('../block')

class UserScript extends Block {
  constructor (data) {
    super(data)
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
    }).then((output) => {
      state.value = output.trim()
      state.next()
    })
  }
}

module.exports = UserScript
