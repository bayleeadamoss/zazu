const path = require('path')
const robot = require('robotjs')
const Application = require('spectron').Application
const $ = require('cheerio')

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

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const eventually = (func, expectedValue) => {
  return func().then((actualValue) => {
    if (actualValue === expectedValue) {
      return true
    } else {
      return new Promise((resolve) => {
        setTimeout(resolve, 100)
      }).then(() => {
        return eventually(func, expectedValue)
      })
    }
  }).catch((err) => {
    console.error('ERROR: ', err)
    return wait(100).then(() => {
      return eventually(func, expectedValue)
    })
  })
}

module.exports = function () {
  this.World = World

  this.Given(/^I have "([^"]*)" as a plugin$/, function (plugin) {
    if (plugin !== 'tinytacoteam/zazu-fixture') {
      return Promise.reject('We should make this dynamic.')
    }
    return Promise.resolve()
  })

  this.Given(/^the app is launched$/, function () {
    return this.open()
  })

  this.When(/^I toggle it open$/, function () {
    return this.showWindow()
  })

  // assumes modifier is first
  this.When(/^I hit the hotkey "([^"]*)"$/, function (hotkey) {
    var keys = hotkey.split('+')
    return this.hitHotkey(keys[1], keys[0])
  })

  this.When(/^I eventually click on the active result$/, function () {
    return eventually(() => this.hasResults(), true).then(() => {
      return wait(100)
    }).then(() => {
      return this.clickActiveResult()
    })
  })

  this.Then(/^my clipboard contains "([^"]*)"$/, function (expected, callback) {
    this.readClipboard().then((actual) => {
      if (actual === expected) {
        callback()
      } else {
        callback(new Error('Expected "' + expected + '" to be in your clipbaord but found "' + actual + '"'))
      }
    })
  })

  this.Then(/^the search window is not visible$/, function () {
    return eventually(() => this.isWindowVisible(), false)
  })

  this.Then(/^the search window is(?: eventually)? visible$/, function () {
    return eventually(() => this.isWindowVisible(), true)
  })

  this.Then(/^I have (\d+) results$/, function (expected) {
    return eventually(() => {
      return this.getResultItems().then((items) => items.length)
    }, parseInt(expected, 10))
  })

  this.When(/^I type in "([^"]*)"$/, function (input, callback) {
    this.type(input)
    callback()
  })

  this.Then(/^the results should contain "([^"]*)"$/, function (subset, callback) {
    this.getResults().then((resultText) => {
      if (resultText.match(subset)) {
        callback()
      } else {
        callback(new Error('Expected results to contain "' + subset + '"'))
      }
    })
  })
}
