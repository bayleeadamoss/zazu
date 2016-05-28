const cuid = require('cuid')
const electron = require('electron')

const Template = require('../../lib/template')

class CopyToClipboard {
  constructor (data) {
    this.id = data && data.id || cuid()
    this.clipboard = electron.clipboard
    this.text = data.text
  }

  call (state) {
    this.clipboard.writeText(Template.compile(this.text, {
      value: String(state.value),
    }))
    state.next()
  }
}

module.exports = CopyToClipboard
