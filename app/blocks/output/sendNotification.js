import cuid from 'cuid'
import notification from '../../lib/notification'

import Template from '../../lib/template'

export default class SendNotification {
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
