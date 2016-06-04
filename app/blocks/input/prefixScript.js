const Process = require('../../lib/process')
const Template = require('../../lib/template')
const InputBlock = require('../inputBlock')

class PrefixScript extends InputBlock {
  constructor (data) {
    super(data)
    this.cwd = data.cwd
    this.prefix = data.prefix
    this.space = data.space
    this.args = data.args
    this.script = data.script
  }

  respondsTo (input) {
    var regex = ['^']
    if (!this.isScoped) {
      regex.push(this.prefix)
      if (this.space) {
        regex.push(' ')
      }
    }
    if (this.args.match(/^r/i)) {
      regex.push('(.+)')
    } else if (this.args.match(/^o/i)) {
      regex.push('(.*)')
    }
    regex.push('$')
    return this.active() && input.match(new RegExp(regex.join(''), 'i'))
  }

  query (input) {
    return this.respondsTo(input)[1]
  }

  search (input, env = {}) {
    if (this.lastProcess) {
      this.lastProcess.cancel()
    }
    const query = this.query(input)
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

module.exports = PrefixScript
