const InputBlock = require('../inputBlock')

class Keyword extends InputBlock {
  constructor (data) {
    super(data)
    this.keyword = data.keyword
    this.title = data.title
    this.subtitle = data.subtitle
  }

  respondsTo (input) {
    return this.keyword.indexOf(input) !== -1 && input.length > 2
  }

  search (input, env = {}) {
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
