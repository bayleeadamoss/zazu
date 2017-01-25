const path = require('path')
const robot = require('robotjs')
const Application = require('spectron').Application
const $ = require('cheerio')
const jetpack = require('fs-jetpack')
const { git, clone } = require('../../app/lib/git')

const appPath = path.join(__dirname, '../../app')
const homeDir = path.join(__dirname, '../../test/fixtures/home')
const pluginDir = path.join(homeDir, '.zazu/plugins')
const calcProfile = path.join(homeDir, '.calculator.zazurc.json')
const fallbackProfile = path.join(homeDir, '.fallback.zazurc.json')
const homeProfile = path.join(homeDir, '.zazurc.json')

class World {
  profile (name) {
    this.profileType = name
    if (this.profileType === 'calculator') {
      jetpack.copy(calcProfile, homeProfile, { overwrite: true })
    } else if (this.profileType === 'fallback') {
      jetpack.copy(fallbackProfile, homeProfile, { overwrite: true })
    }
    this.app = new Application({
      path: require('electron-prebuilt'),
      args: [appPath],
      env: {
        NODE_ENV: 'test',
        ZAZU_HOME: homeDir,
      },
    })
    return Promise.resolve()
  }

  open () {
    return this.app.start().then(() => {
      const time = this.profileType === 'calculator' ? 25 * 1000 : 5 * 1000
      return wait(time) // give it time to load plugins
    })
  }

  isWindowVisible () {
    return this.app.browserWindow.isVisible()
  }

  hasResults () {
    return this.app.client.isExisting('.results')
  }

  accessibility () {
    return this.app.client.auditAccessibility()
  }

  updatePlugins () {
    return this.app.webContents.send('updatePlugins').then(() => {
      return wait(10 * 1000) // give it time to update the plugin
    })
  }

  getQuery () {
    return this.app.client.getValue('input')
  }

  type (input) {
    this.app.client.setValue('input', input)
  }

  showWindow () {
    return Promise.resolve(this.hitHotkey('space', 'shift'))
  }

  hitHotkey (key, modifier) {
    return Promise.resolve(robot.keyTap(key, modifier))
  }

  close () {
    if (this.app) {
      return this.app.stop()
    }
    return Promise.resolve()
  }

  clickActiveResult () {
    return this.app.client.click('li.active')
  }

  getActiveHeader () {
    return this.app.client.getText('li.active h2')
  }

  getResults () {
    return this.app.client.getText('.results')
  }

  getResultItems () {
    return this.app.client.getHTML('.results').then((results) => {
      return $(results).find('li')
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
  const assert = (actualValue) => {
    if (actualValue !== expectedValue) {
      throw new Error('Values didnt match')
    }
  }
  return new Promise((resolve, reject) => {
    let iterations = 0
    const retry = () => {
      iterations++
      if (iterations >= 30) {
        reject('Forever is a long time')
      } else {
        func().then(assert).then(resolve).catch(() => {
          return wait(100).then(retry)
        })
      }
    }
    retry()
  })
}

module.exports = function () {
  this.World = World

  this.Given(/^I have "([^"]*)" as a plugin$/, function (plugin) {
    if (plugin === 'tinytacoteam/zazu-fixture') {
      return this.profile('default')
    } else if (plugin === 'tinytacoteam/zazu-calculator') {
      return this.profile('calculator')
    }
    return Promise.reject('Profile not found')
  })

  this.Given(/^the app is launched$/, {timeout: 35 * 1000}, function () {
    return this.open()
  })

  this.Given(/^I have "tinytacoteam\/zazu-fallback" installed before mdn support$/, function () {
    const fallbackDir = path.join(pluginDir, 'tinytacoteam', 'zazu-fallback')
    return clone('tinytacoteam/zazu-fallback', fallbackDir).then(() => {
      return git(['reset', '--hard', 'aab89b7'], { cwd: fallbackDir })
    }).then(() => {
      return this.profile('fallback')
    })
  })

  this.Given(/^I update the plugins$/, {timeout: 15 * 1000}, function () {
    return this.updatePlugins()
  })

  this.When(/^I toggle it open$/, function () {
    return this.showWindow()
  })

  // assumes modifier is first
  this.When(/^I hit the hotkey "([^"]*)"$/, function (hotkey) {
    var keys = hotkey.split('+')
    return this.hitHotkey(keys[1], keys[0]).then(() => {
      return wait(100)
    })
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

  this.Then(/^the search window is visible$/, function () {
    return eventually(() => this.isWindowVisible(), true)
  })

  this.Then(/^I have (\d+) results?$/, function (expected) {
    return eventually(() => {
      return this.getResultItems().then((items) => items.length)
    }, parseInt(expected, 10))
  })

  this.When(/^I type in "([^"]*)"$/, function (input) {
    this.type(input)
    return eventually(() => {
      return this.getQuery()
    }, input)
  })

  this.Then(/^I have no results$/, function () {
    return eventually(() => this.hasResults(), false)
  })

  this.Then(/^the active result contains "([^"]*)"$/, function (header) {
    return eventually(() => this.hasResults(), true).then(() => {
      return wait(100)
    }).then(() => {
      return eventually(() => this.getActiveHeader(), header)
    })
  })

  this.Then(/^I have no accessibility warnings$/, function () {
    return this.accessibility().then((response) => {
      if (response.results.length !== 0) {
        throw new Error('You have accessibility issues')
      }
    })
  })

  this.Then(/^the results contain "([^"]*)"$/, function (subset, callback) {
    this.getResults().then((resultText) => {
      if (resultText.match(subset)) {
        callback()
      } else {
        callback(new Error('Expected results to contain "' + subset + '"'))
      }
    })
  })
}
