const notifier = require('node-notifier')

class Notification {
  constructor () {
    this.active = false
    this.queue = []
  }

  push (data) {
    return new Promise((resolve) => {
      this.queue.push(this._notification(data, resolve))
      this.displayFirstNotificationInQueue()
    })
  }

  _notification (data, callback) {
    const options = Object.assign({}, data, { wait: true })
    return () => {
      callback()
      this.active = true
      notifier.notify(options, () => {
        this.active = false
        this.displayFirstNotificationInQueue()
      })
    }
  }

  displayFirstNotificationInQueue () {
    if (!this.active && this.queue.length > 0) {
      this.queue.shift()()
    }
  }
}

module.exports = new Notification()
