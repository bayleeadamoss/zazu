const Block = require('./block')

const globalEmitter = require('../lib/globalEmitter')
const truncateResult = require('../lib/truncateResult')

class InputBlock extends Block {
  constructor (data) {
    super(data)
    this.pluginId = data.pluginId
    this.isScoped = null
    this.debounce = data.debounce || 100
  }

  isActive () {
    return this.isScoped !== false
  }

  setScoped (value) {
    this.isScoped = value
  }

  _validateResults (results) {
    if (!Array.isArray(results)) {
      this.logger.log('error', 'results must be an array', {
        results,
      })
      return []
    }
    results.forEach((result) => {
      const keys = Object.keys(result)
      if (!keys.includes('title')) {
        this.logger.log('error', 'result must contain a title', { result: truncateResult(result) })
      }
      if (!keys.includes('value')) {
        this.logger.log('error', 'result must contain a value', { result: truncateResult(result) })
      }
    })
    return results
  }

  call (state) {
    setImmediate(() => {
      globalEmitter.emit('showWindow', this.pluginId, this.id)
    })
    return Promise.resolve()
  }
}

module.exports = InputBlock
