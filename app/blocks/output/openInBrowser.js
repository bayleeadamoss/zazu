const { shell } = require('electron')

const Template = require('../../lib/template')
const Block = require('../block')

class OpenInBrowser extends Block {
  constructor (data) {
    super(data)
    this.url = data.url
  }

  call (state) {
    shell.openExternal(Template.compile(this.url, {
      value: String(state.value),
    }))
    state.next()
  }
}

module.exports = OpenInBrowser
