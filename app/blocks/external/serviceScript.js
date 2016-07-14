const EventEmitter = require('events')
const cuid = require('cuid')
const globalEmitter = require('../../lib/globalEmitter')

const Process = require('../../lib/process')

class ServiceScript extends EventEmitter {
  constructor (data, env) {
    super()
    this.cwd = data.cwd
    this.env = env
    this.type = data.type
    this.id = data.id || cuid()
    this.connections = []

    this.script = data.script
    this.interval = parseInt(data.interval, 10)
    if (isNaN(this.interval) || this.interval < 100) {
      this.interval = 100
    }
    this.setup()
  }

  call () {}

  setup () {
    setTimeout(() => {
      let promise = this.handle()
      globalEmitter.on('kill_it', () => {
        promise.cancel()
      })
    }, this.interval)
  }

  handle () {
    return Process.execute(this.script, {
      cwd: this.cwd,
      env: Object.assign({}, process.env, this.env),
    }).then((results) => {
      this.setup()
    })
  }
}

module.exports = ServiceScript
