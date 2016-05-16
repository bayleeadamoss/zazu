import cuid from 'cuid'

import Process from '../../lib/process'
import Template from '../../lib/template'

export default class PrefixScript {
  constructor (data) {
    this.id = data.id || cuid()
    this.cwd = data.cwd
    this.prefix = data.prefix
    this.space = data.space
    this.args = data.args
    this.script = data.script
    this.connections = data.connections
  }

  respondsTo (input) { // cha cent
    var regex = ['^']
    regex.push(this.prefix)
    if (this.space) {
      regex.push(' ')
    }
    if (this.args.match(/^r/i)) {
      regex.push('(.+)')
    } else if (this.args.match(/^o/i)) {
      regex.push('(.*)')
    }
    regex.push('$')
    return input.match(new RegExp(regex.join(''), 'i'))
  }

  query (input) {
    return this.respondsTo(input)[1]
  }

  call (input, env = {}) {
    const query = this.query(input)
    const script = Template.compile(this.script, {
      query,
    })

    return Process.execute(script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, env),
    }).then((results) => {
      return JSON.parse(results)
    })
  }
}
