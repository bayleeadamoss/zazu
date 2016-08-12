const path = require('path')
const robot = require('robotjs')
const Application = require('spectron').Application

class World {
  constructor () {
    const appPath = path.join(__dirname, '../../app')
    const homePath = path.join(__dirname, '../../test/fixtures/home')
    console.log({appPath, homePath})
    this.app = new Application({
      path: require('electron-prebuilt'),
      args: [appPath],
      env: {
        NODE_ENV: 'test',
        HOME: homePath,
        USERPROFILE: homePath,
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

  showWindow () {
    return this.app.start().then(() => {
      return robot.keyTap('space', 'shift')
    })
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

  this.When(/^I open the application$/, function () {
    return this.showWindow()
  })

  this.When(/^I wait "([^"]*)" milliseconds$/, function (seconds, callback) {
    setTimeout(() => {
      callback()
    }, parseInt(seconds, 10))
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
