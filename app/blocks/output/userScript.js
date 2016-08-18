const Block = require('../block')
const freshRequire = require('../../lib/freshRequire')

const path = require('path')

class UserScript extends Block {
  constructor (data) {
    super(data)
    try {
      const plugin = freshRequire(path.join(data.cwd, data.script))
      const electron = require('electron')
      this.script = plugin({
        console: this.logger,
        cwd: data.cwd,
        clipboard: electron.clipboard,
        nativeImage: electron.nativeImage,
      })
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  call (state, env = {}) {
    if (!this.script) {
      this.logger.log('error', 'Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return Promise.resolve()
    }
    this.logger.log('verbose', 'Executing Script', { value: state.value })
    return this.script(state.value, env).then((output) => {
      state.value = output
      this.logger.log('info', 'User Script results', { value: state.value })
      return state.next()
    }).catch((error) => {
      this.logger.log('error', 'User Script failed', { value: state.value, error })
    })
  }
}

module.exports = UserScript
