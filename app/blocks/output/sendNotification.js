const notification = require('../../lib/notification')
const Template = require('../../lib/template')
const Block = require('../block')

class SendNotification extends Block {
  constructor (data) {
    super(data)
    this.title = data.title
    this.message = data.message
  }

  call (state) {
    const variables = { value: String(state.value) }
    notification.push({
      title: Template.compile(this.title, variables),
      message: Template.compile(this.message, variables),
    })
    state.next()
  }
}

module.exports = SendNotification
