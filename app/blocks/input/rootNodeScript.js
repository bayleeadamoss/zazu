const path = require('path')

const RootScript = require('./rootScript')

class RootNodeScript extends RootScript {
  constructor (data) {
    super(data)
    try {
      const plugin = require(path.join(this.cwd, this.script))
      this.script = plugin({
        console: this.logger,
        cwd: this.cwd,
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
    return this.script.respondsTo(input)
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

module.exports = RootNodeScript
