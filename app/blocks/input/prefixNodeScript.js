const path = require('path')

const PrefixScript = require('./prefixScript')

class PrefixNodeScript extends PrefixScript {
  constructor (data) {
    super(data)
    try {
      this.script = require(path.join(this.cwd, this.script))(this.pluginContext())
    } catch (e) {
      this.script = false
      this.loadError = e
    }
  }

  pluginContext () {
    return {
      console: {
        log: (message, data) => this.log(message, data),
        warn: (message, data) => this.warn(message, data),
        error: (message, data) => this.error(message, data),
      },
    }
  }

  respondsTo (input) {
    if (!this.script) {
      this.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return false
    }
    return super.respondsTo(input)
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.log('Executing Node Script', { query })
    return this.script(query, env).then((results) => {
      this.log('Node Script Results', { results })
      return results
    }).catch((error) => {
      this.error('Node Script failed', { query, error })
    })
  }
}

module.exports = PrefixNodeScript
