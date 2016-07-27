const InputBlock = require('../inputBlock')

const path = require('path')

class PrefixScript extends InputBlock {
  constructor (data) {
    super(data)
    this.prefix = data.prefix
    this.space = data.space
    this.args = data.args
    try {
      const plugin = require(path.join(data.cwd, data.script))
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

  respondsTo (input) {
    if (!this.script) {
      this.logger.error('Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return []
    }
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
    const respondsTo = this.active() && input.match(new RegExp(regex.join(''), 'i'))
    this.logger.log('Responds to input', { input, respondsTo })
    return respondsTo
  }

  query (input) {
    return this.respondsTo(input)[1]
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.logger.log('Executing Script', { query })
    return this.script(query, env).then((results) => {
      this.logger.log('Script Results', { results })
      return results
    }).catch((error) => {
      this.logger.error('Script failed', { query, error })
    })
  }
}

module.exports = PrefixScript
