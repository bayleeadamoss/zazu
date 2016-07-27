const InputBlock = require('../inputBlock')

const path = require('path')

class RootScript extends InputBlock {
  constructor (data) {
    super(data)
    try {
      const plugin = require(path.join(data.cwd, data.script))
      this.script = plugin({
        console: this.logger,
        cwd: path.cwd,
      })
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  respondsTo (input) {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return false
    }
    const respondsTo = this.active() && this.script.respondsTo(input)
    this.logger.log('Responds to input', { input, respondsTo })
    return respondsTo
  }

  query (input) {
    return input
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.logger.log('Executing Root Node Script', { query })
    return this.script.search(query, env).then((results) => {
      this.logger.log('Node Root Script Results', { results })
      return results
    }).catch((error) => {
      this.logger.error('Node Script failed', { query, error })
    })
  }
}

module.exports = RootScript
