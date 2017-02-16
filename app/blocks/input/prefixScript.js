const InputBlock = require('../inputBlock')

const path = require('path')

class PrefixScript extends InputBlock {
  constructor (data) {
    super(data)
    this.prefix = data.prefix || this.requiredField('prefix')
    this.args = data.args || this.requiredField('args')
    this.space = !!data.space
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
      this.logger.error('Plugin failed to load', this.loadError)
      return false
    }
    var regex = ['^']
    if (this.isScoped) {
      regex.push('(.*)')
    } else {
      regex.push(this.prefix)
      if (this.space) {
        regex.push(' ')
      }
      if (this.args.match(/^r/i)) {
        regex.push('(.+)')
      } else if (this.args.match(/^o/i)) {
        regex.push('(.*)')
        if (this.space) {
          regex.push('$|^' + this.prefix)
        }
      }
    }
    regex.push('$')
    const respondsTo = input.match(new RegExp(regex.join(''), 'i'))
    this.logger.log('info', 'respondsTo', { input, respondsTo })
    return respondsTo
  }

  query (input) {
    const respondsTo = this.respondsTo(input)
    return respondsTo ? respondsTo[1] || '' : ''
  }

  search (input, env = {}) {
    const query = this.query(input)
    this.logger.log('verbose', 'Executing Script', { query })
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        timeout === this.timeout ? resolve() : reject('Debounced')
      }, this.debounce)
      this.timeout = timeout
    }).then(() => {
      return this._ensurePromise(this.script(query, env))
    }).then((results) => {
      this.logger.log('info', 'Script Results', { results })
      return this._validateResults(results.map((result) => {
        return Object.assign({}, result, {
          blockRank: 3,
        })
      }))
    }).then((results) => {
      if (this.isScoped && results.length === 0) {
        return [
          {
            title: this.id + ' is scoped',
            subtitle: 'Type to see more...',
          },
        ]
      }
      return results
    }).catch((error) => {
      this.logger.error('Script failed', { query, error })
    })
  }
}

module.exports = PrefixScript
