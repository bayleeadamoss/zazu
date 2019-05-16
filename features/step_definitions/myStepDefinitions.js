const { setWorldConstructor, setDefaultTimeout, Given, When, Then } = require('cucumber')
const path = require('path')
const os = require('os')
const childProcess = require('child_process')
const { promisify } = require('util')
const isTravis = require('is-travis')
const Application = require('spectron').Application
const $ = require('cheerio')
const jetpack = require('fs-jetpack')
const { git, clone } = require('../../app/lib/git')
const exec = promisify(childProcess.exec)

const appPath = path.join(__dirname, '../../')
const homeDir = path.join(__dirname, '../../test/fixtures/home')
const pluginDir = path.join(homeDir, '.zazu/plugins')
const calcProfile = path.join(homeDir, '.calculator.zazurc.json')
const fallbackProfile = path.join(homeDir, '.fallback.zazurc.json')
const homeProfile = path.join(homeDir, '.zazurc.json')

setDefaultTimeout(60 * 1000)

class World {
  profile (name) {
    this.profileType = name
    if (this.profileType === 'calculator') {
      jetpack.copy(calcProfile, homeProfile, { overwrite: true })
    } else if (this.profileType === 'fallback') {
      jetpack.copy(fallbackProfile, homeProfile, { overwrite: true })
    }
    this.app = new Application({
      path: require('electron'),
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
      const time = this.profileType === 'calculator' ? 50 * 1000 : 5 * 1000
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

  async type (input) {
    for (const char of input) {
      await this.hitKey(char)
    }
    await wait(500)
  }

  showWindow () {
    return this.hitKey('space', 'shift')
  }

  hideWindow () {
    return this.hitKey('space', 'shift')
  }

  hitKey (key, modifier) {
    if (os.type() === 'Darwin' && !isTravis) {
      const keyForAppleScript = key.length === 1 ? `\\"${key}\\"` : key
      if (modifier) {
        const modifierForAppleScript = modifier.replace('alt', 'option')
        return exec(`Script="tell app \\"System Events\\" to keystroke ${keyForAppleScript} using ${modifierForAppleScript} down"
          osascript -e "$Script"`)
      } else {
        return exec(`Script="tell app \\"System Events\\" to keystroke ${keyForAppleScript}"
          osascript -e "$Script"`)
      }
    }
    const robot = require('robotjs')
    if (modifier) {
      return Promise.resolve(robot.keyTap(key, modifier))
    } else {
      // * will becomes 8, see https://github.com/octalmage/robotjs/issues/285
      const robotjsBadChars = /[~!@#$%^&*()_+{}|:"<>?]/
      let match = key.match(robotjsBadChars)
      if (match) {
        return Promise.resolve(robot.keyTap(key, 'shift'))
      }
      return Promise.resolve(robot.keyTap(key))
    }
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
    return this.app.client.getHTML('.results').then(results => {
      return $(results).find('li')
    })
  }

  readClipboard () {
    return this.app.electron.clipboard.readText()
  }
}

const wait = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

const eventually = (func, expectedValue) => {
  const assert = actualValue => {
    if (actualValue !== expectedValue) {
      throw new Error('Values didnt match')
    }
  }
  return new Promise((resolve, reject) => {
    let iterations = 0
    const retry = () => {
      iterations++
      if (iterations >= 50) {
        reject(new Error('Forever is a long time'))
      } else {
        func()
          .then(assert)
          .then(resolve)
          .catch(() => {
            return wait(100).then(retry)
          })
      }
    }
    retry()
  })
}

setWorldConstructor(World)

Given('I have {string} as a plugin', function (plugin) {
  if (plugin === 'tinytacoteam/zazu-fixture') {
    return this.profile('default')
  } else if (plugin === 'tinytacoteam/zazu-calculator') {
    return this.profile('calculator')
  }
  return Promise.reject(new Error('Profile not found'))
})

Given('the app is launched', { timeout: 120 * 1000 }, function () {
  return this.open()
})

Given('I have {string} installed before packagist support', function (plugin) {
  const fallbackDir = path.join(pluginDir, plugin)
  return clone(plugin, fallbackDir)
    .then(() => {
      return git(['reset', '--hard', '16e4e50'], { cwd: fallbackDir })
    })
    .then(() => {
      return this.profile('fallback')
    })
})

Given('I update the plugins', { timeout: 15 * 1000 }, function () {
  return this.updatePlugins()
})

When('I toggle it open', function () {
  return this.showWindow()
})

When('I toggle it closed', function () {
  return this.hideWindow()
})

// assumes modifier is first
When('I hit the hotkey {string}', function (hotkey) {
  var keys = hotkey.split('+')
  return this.hitKey(keys[1], keys[0]).then(() => {
    return wait(100)
  })
})

When('I hit the key {string}', function (hotkey) {
  return this.hitKey(hotkey).then(() => {
    return wait(100)
  })
})

When('I eventually click on the active result', function () {
  return eventually(() => this.hasResults(), true)
    .then(() => {
      return wait(100)
    })
    .then(() => {
      return this.clickActiveResult()
    })
})

Then('my clipboard contains {string}', function (expected, callback) {
  this.readClipboard().then(actual => {
    if (actual === expected) {
      callback()
    } else {
      callback(new Error('Expected "' + expected + '" to be in your clipbaord but found "' + actual + '"'))
    }
  })
})

Then('the search window is not visible', function () {
  return eventually(() => this.isWindowVisible(), false)
})

Then('the search window is visible', function () {
  return eventually(() => this.isWindowVisible(), true)
})

Then('I have {int} result(s)', function (expected) {
  return eventually(() => {
    return this.getResultItems().then(items => items.length)
  }, parseInt(expected, 10))
})

Then('the input is empty', function () {
  return eventually(() => {
    return this.getQuery()
  }, '')
})

Then('the input is {string}', function (expected) {
  return eventually(() => {
    return this.getQuery()
  }, expected)
})

When('I type in {string}', function (input) {
  return this.type(input).then(() =>
    eventually(() => {
      return this.getQuery()
    }, input)
  )
})

Then('I have no results', function () {
  return eventually(() => this.hasResults(), false)
})

Then('the active result contains {string}', function (header) {
  return eventually(() => this.hasResults(), true)
    .then(() => {
      return wait(100)
    })
    .then(() => {
      return eventually(() => this.getActiveHeader(), header)
    })
})

Then('I have no accessibility warnings', function () {
  return this.accessibility().then(response => {
    if (response.results.length !== 0) {
      throw new Error('You have accessibility issues')
    }
  })
})

Then('the results contain {string}', function (subset, callback) {
  this.getResults().then(resultText => {
    if (resultText.match(subset)) {
      callback()
    } else {
      callback(new Error('Expected results to contain "' + subset + '"'))
    }
  })
})
