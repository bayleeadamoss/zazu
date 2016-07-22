const RootScript = require('./rootScript')

class PrefixScript extends RootScript {
  constructor (data) {
    super(data)
    this.prefix = data.prefix
    this.space = data.space
    this.args = data.args
  }

  respondsTo (input) {
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

}

module.exports = PrefixScript
