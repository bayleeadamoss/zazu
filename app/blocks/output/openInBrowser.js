const childProcess = require('child_process')
const { promisify } = require('util')
const exec = promisify(childProcess.exec)

const Template = require('../../lib/template')
const getOpenFileShellCommand = require('../../lib/getOpenFileShellCommand')
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
    const command = `${getOpenFileShellCommand()} "${url}"`
    this.logger.log('info', 'Opening in browser', { url, command })
    return exec(command)
      .catch(error => {
        this.logger.info('error', 'Opening in browser', { command, error, errorString: String(error) })
      })
      .then(() => {
        return state.next()
      })
  }
}

module.exports = OpenInBrowser
