const notification = require('../../lib/notification')
const Template = require('../../lib/template')
const Block = require('../block')

class SendNotification extends Block {
  constructor (data) {
    super(data)
    this.title = data.title || '{value}'
    this.message = data.message || '{value}'
  }

  call (state) {
    const variables = { value: String(state.value) }
    const options = {
      title: Template.compile(this.title, variables),
      message: Template.compile(this.message, variables),
    }
    this.logger.log('info', 'Notification', options)
    notification.push(options)
    return state.next()
  }
}

module.exports = SendNotification
