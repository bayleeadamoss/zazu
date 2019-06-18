const InputBlock = require('../inputBlock')

class Keyword extends InputBlock {
  constructor (data) {
    super(data)
    this.keyword = data.keyword || this.requiredField('keyword')
    this.title = data.title || this.requiredField('title')
    this.subtitle = data.subtitle
    this.icon = data.icon
  }

  respondsTo (input) {
    const longEnough = input.length > 2
    const partOfKeyword = this.keyword.indexOf(input) !== -1
    const respondsTo = longEnough && !!partOfKeyword
    this.logger.log('verbose', `${respondsTo ? 'r' : 'notR'}esponds to input`, { input, respondsTo })
    return respondsTo
  }

  search (input, env = {}) {
    this.logger.log('info', 'Rendering keyword', { input })
    return Promise.resolve([
      {
        blockRank: 2,
        title: this.title,
        subtitle: this.subtitle,
        value: this.keyword,
        icon: this.icon,
      },
    ])
  }
}

module.exports = Keyword
