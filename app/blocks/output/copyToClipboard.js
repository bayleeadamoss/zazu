const electron = require('electron')

const Template = require('../../lib/template')
const Block = require('../block')

class CopyToClipboard extends Block {
  constructor (data) {
    super(data)
    this.clipboard = electron.clipboard
    this.text = data.text
  }

  call (state) {
    this.logger.log('Copying to clipboard', { value: state.value })
    this.clipboard.writeText(Template.compile(this.text, {
      value: String(state.value),
    }))
    state.next()
  }
}

module.exports = CopyToClipboard
