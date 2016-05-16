import cuid from 'cuid'

import Process from '../../lib/process'
import Template from '../../lib/template'

export default class UserScript {
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
