const cuid = require('cuid')
const { shell } = require('electron')

const Template = require('../../lib/template')

class OpenInBrowser {
  constructor (data) {
    this.id = data && data.id || cuid()
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
