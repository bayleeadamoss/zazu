const electron = require('electron')

const Template = require('../../lib/template')
const Block = require('../block')

class CopyToClipboard extends Block {
  constructor (data) {
    super(data)
    this.clipboard = electron.clipboard
    this.text = data.text || '{value}'
  }

  call (state) {
    this.logger.log('info', 'Copying to clipboard')
    this.clipboard.writeText(Template.compile(this.text, {
      value: String(state.value),
    }))
    return state.next()
  }
}

module.exports = CopyToClipboard
