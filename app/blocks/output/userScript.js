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

    this.log('Executing Script', { script })
    return Process.execute(script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    }).then((output) => {
      state.value = output.trim()
      this.log('Script results', { value: state.value })
      state.next()
    }).catch((error) => {
      this.error('Script failed', { script, error })
    })
  }
}

module.exports = UserScript
