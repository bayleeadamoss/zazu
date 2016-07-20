const InputBlock = require('../inputBlock')

class Keyword extends InputBlock {
  constructor (data) {
    super(data)
    this.keyword = data.keyword
    this.title = data.title
    this.subtitle = data.subtitle
  }

  respondsTo (input) {
    const respondsTo = this.active() &&
      this.keyword.indexOf(input) !== -1 &&
      input.length > 2
    this.log('Responds to input', { input, respondsTo })
    return respondsTo
  }

  search (input, env = {}) {
    this.log('Rendering keyword', { input })
    return new Promise((resolve) => {
      resolve([
        {
          title: this.title,
          subtitle: this.subtitle,
          value: this.keyword,
        },
      ])
    })
  }
}

module.exports = Keyword
