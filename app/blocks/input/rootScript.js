const InputBlock = require('../inputBlock')

const path = require('path')

class RootScript extends InputBlock {
  constructor (data) {
    super(data)
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
    const respondsTo = this.script.respondsTo(input)
    this.logger.log('info', 'Responds to input', { input, respondsTo })
    return respondsTo
  }

  query (input) {
    return input
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
      return this._ensurePromise(this.script.search(query, env))
    }).then((results) => {
      this.logger.log('info', 'Script Results', { results })
      return this._validateResults(results.map((result) => {
        return Object.assign({}, result, {
          blockRank: 1,
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

module.exports = RootScript
