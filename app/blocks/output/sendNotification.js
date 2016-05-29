const cuid = require('cuid')
const notification = require('../../lib/notification')

const Template = require('../../lib/template')

class SendNotification {
  constructor (data) {
    this.id = data && data.id || cuid()
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
