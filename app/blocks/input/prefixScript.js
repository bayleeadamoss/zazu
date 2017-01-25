const InputBlock = require('../inputBlock')
const freshRequire = require('../../lib/freshRequire')

const path = require('path')

class PrefixScript extends InputBlock {
  constructor (data) {
    super(data)
    this.prefix = data.prefix || this.requiredField('prefix')
    this.args = data.args || this.requiredField('args')
    this.space = !!data.space
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

  respondsTo (input) {
    if (!this.script) {
      this.logger.log('error', 'Plugin failed to load', {
        message: this.loadError.message,
        stack: this.loadError.stack.split('\n'),
      })
      return false
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
    const respondsTo = input.match(new RegExp(regex.join(''), 'i'))
    this.logger.log('info', 'respondsTo', { input, respondsTo })
    return respondsTo
  }

  query (input) {
    const respondsTo = this.respondsTo(input)
    return respondsTo ? respondsTo[1] : ''
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.logger.log('verbose', 'Executing Script', { query })
    return this._ensurePromise(this.script(query, env)).then((results) => {
      this.logger.log('info', 'Script Results', { results })
      return this._validateResults(results.map((result) => {
        return Object.assign({}, result, {
          blockRank: 3,
        })
      }))
    }).catch((error) => {
      this.logger.log('error', 'Script failed', { query, error })
    })
  }
}

module.exports = PrefixScript
