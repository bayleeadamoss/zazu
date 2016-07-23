const path = require('path')

const UserScript = require('./userScript')

class UserNodeScript extends UserScript {
  constructor (data) {
    super(data)
    try {
      const plugin = require(path.join(this.cwd, this.script))
      this.script = plugin(this.logger)
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  call (state, env = {}) {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return Promise.resolve()
    }
    this.logger.log('Executing User Node Script', { value: state.value })
    return this.script(state.value, env).then((output) => {
      state.value = output.trim()
      this.logger.log('User Node Script results', { value: state.value })
      state.next()
    }).catch((error) => {
      this.logger.error('User Node Script failed', { value: state.value, error })
    })
  }
}

module.exports = UserNodeScript
