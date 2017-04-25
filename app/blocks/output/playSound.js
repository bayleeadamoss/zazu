const path = require('path')
const Template = require('../../lib/template')
const Block = require('../block')

class PlaySound extends Block {
  constructor (data) {
    super(data)
    this.file = data.file
    this.cwd = data.cwd
  }

  call (state, env = {}) {
    const file = Template.compile(this.file, {
      value: String(state.value),
    })
    const fullPath = path.join(this.cwd, file)

    this.logger.log('info', 'Playing File', { fullPath })

    const audio = new Audio(fullPath)
    return new Promise((resolve) => {
      return audio.play().then(() => {
        audio.addEventListener('ended', resolve)
      })
    }).then(() => {
      return state.next()
    })
  }
}

module.exports = PlaySound
