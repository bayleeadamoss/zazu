import notification from './lib/notification'
import Package from './package'
import jetpack from 'fs-jetpack'
import path from 'path'

export default class Theme extends Package {
  constructor (url, dir) {
    super(url, dir)
    this.loaded = false
  }

  load () {
    return super.load().then((plugin) => {
      plugin.css = jetpack.read(path.join(this.path, plugin.stylesheet))
      return plugin
    }).catch((errorMessage) => {
      notification.push({
        title: 'Theme failed',
        message: errorMessage,
      })
    })
  }
}
