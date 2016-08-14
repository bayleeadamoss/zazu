const InputBlock = require('../inputBlock')

class Keyword extends InputBlock {
  constructor (data) {
    super(data)
    this.keyword = data.keyword
    this.title = data.title
    this.subtitle = data.subtitle
    this.icon = data.icon
  }

  respondsTo (input) {
    const longEnough = input.length > 2
    const partOfKeyword = this.keyword.indexOf(input) !== -1
    const respondsTo = longEnough && partOfKeyword
    this.logger.log('Responds to input', { input, respondsTo })
    return respondsTo
  }

  search (input, env = {}) {
    this.logger.info('Rendering keyword', { input })
    return new Promise((resolve) => {
      resolve([
        {
          title: this.title,
          subtitle: this.subtitle,
          value: this.keyword,
          icon: this.icon,
        },
      ])
    })
  }
}

module.exports = Keyword
