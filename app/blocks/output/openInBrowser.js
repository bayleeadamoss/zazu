const { shell } = require('electron')

const Template = require('../../lib/template')
const Block = require('../block')

class OpenInBrowser extends Block {
  constructor (data) {
    super(data)
    this.url = data.url || '{value}'
  }

  call (state) {
    const url = Template.compile(this.url, {
      value: String(state.value),
    })
    this.logger.log('info', 'Opening in browser', { url })
    shell.openExternal(url)
    return state.next()
  }
}

module.exports = OpenInBrowser
