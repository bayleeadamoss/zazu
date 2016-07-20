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
    const respondsTo = this.active() && this.userRespondsTo(input)
    this.log('Responds to input', { input, respondsTo })
    return respondsTo
  }

  search (query, env = {}) {
    if (this.lastProcess) {
      this.lastProcess.cancel()
    }
    const script = Template.compile(this.script, {
      query,
    })

    this.log('Executing Script', { script })
    this.lastProcess = Process.execute(script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    }).then((results) => {
      const parsed = JSON.parse(results)
      this.log('Script results', { results: parsed })
      return parsed
    }).catch((error) => {
      this.error('Script failed', { script, error })
    })
    return this.lastProcess
  }
}

module.exports = RootScript
