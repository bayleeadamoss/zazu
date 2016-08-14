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

  isResultsVisible () {
    return this.app.client.isVisible('.results')
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
    const check = () => {
      return this.isResultsVisible().then((isVisible) => {
        if (isVisible) {
          return this.clickActiveResult()
        } else {
          return new Promise((resolve) => {
            setTimeout(resolve, 100)
          }).then(() => {
            return check()
          })
        }
      })
    }
    return check()
  })

  this.Then(/^the search window is not visible$/, function (callback) {
    this.isWindowVisible().then((isVisible) => {
      if (!isVisible) {
        return callback()
      }
      return callback(new Error('Window must not be visible'))
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

  this.Then(/^the search window is(?: eventually)? visible$/, function () {
    const check = () => {
      return this.isResultsVisible().then((isVisible) => {
        if (isVisible) {
          return true
        } else {
          return new Promise((resolve) => {
            setTimeout(resolve, 100)
          }).then(() => {
            return check()
          })
        }
      })
    }
    return check()
  })

  this.Then(/^I have (\d+) results$/, function (expected, callback) {
    this.getResultItems().then((actualResults) => {
      const actualLength = actualResults.length
      const expectedLength = parseInt(expected, 10)
      if (expectedLength === actualLength) {
        callback()
      } else {
        callback(new Error('Expected ' + expectedLength + ' to be ' + actualLength))
      }
    })
  })

  this.Then(/^the results should be visible$/, function (callback) {
    this.isResultsVisible().then((isVisible) => {
      if (isVisible) {
        callback()
      } else {
        callback(new Error('Results should be visible'))
      }
    })
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
