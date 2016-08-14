const path = require('path')
const Application = require('spectron').Application
const $ = require('cheerio')
const robot = require('robotjs')

class World {
  constructor () {
    const appPath = path.join(__dirname, '../../app')
    const homeDir = path.join(__dirname, '../../test/fixtures/home')
    this.app = new Application({
      path: require('electron-prebuilt'),
      args: [appPath],
      env: {
        NODE_ENV: 'test',
        ZAZU_HOME: homeDir,
      },
    })
  }

  isWindowVisible () {
    return this.app.browserWindow.isVisible()
  }

  hasResults () {
    return this.app.client.getHTML('.results').then((resultHtml) => {
      return !!resultHtml
    })
  }

  type (input) {
    this.app.client.setValue('input', input)
  }

  open () {
    return this.app.start()
  }

  showWindow () {
    return Promise.resolve(this.hitHotkey('space', 'shift'))
  }

  hitHotkey (key, modifier) {
    return Promise.resolve(robot.keyTap(key, modifier))
  }

  close () {
    return this.app.stop()
  }

  clickActiveResult () {
    return this.app.client.click('li.active')
  }

  isRunning () {
    return this.app.isRunning()
  }

  getResults () {
    return this.app.client.getText('.results')
  }

  getResultItems () {
    return this.app.client.getHTML('.results').then((results) => {
      return $(results).find('li')
    })
  }

  windowCount () {
    return this.app.client.getWindowCount().catch((err) => {
      console.log('ERROR:', err)
    })
  }

  readClipboard () {
    return this.app.electron.clipboard.readText()
  }
}

module.exports = World
