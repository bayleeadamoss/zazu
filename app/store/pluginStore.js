const EventEmitter = require('events')

const configuration = require('../configuration')
const Plugin = require('../plugin')
const Theme = require('../theme')
const track = require('../lib/track')
const globalEmitter = require('../lib/globalEmitter')
const notification = require('../lib/notification')

const CHANGE_RESULTS_EVENT = 'results_change'
const CHANGE_QUERY_EVENT = 'query_change'
const CHANGE_THEME_EVENT = 'theme_change'

class PluginStore extends EventEmitter {
  constructor () {
    super()
    this.query = ''
    this.results = []
    this.plugins = []
    globalEmitter.on('updatePlugins', () => {
      this.update().then(() => {
        return this.load()
      })
    })
  }

  load () {
    configuration.load()
    return this.loadTheme().then(() => {
      return this.loadPlugins()
    }).then(() => {
      notification.push({
        title: 'Plugins loaded',
        message: 'Your plugins have been loaded',
      })
    })
  }

  loadTheme () {
    this.theme = new Theme(configuration.theme, configuration.pluginDir)
    return this.theme.load().then((theme) => {
      track.addPageAction('loadedPackage', {
        packageType: 'theme',
        packageName: configuration.theme,
      })
      this.emitThemeChange(theme)
    })
  }

  loadPlugins () {
    this.plugins = []
    return Promise.all(configuration.plugins.map((plugin) => {
      let pluginObj
      if (typeof plugin === 'object') {
        pluginObj = new Plugin(plugin.name, plugin.variables)
      } else {
        pluginObj = new Plugin(plugin)
      }
      this.plugins.push(pluginObj)
      return pluginObj.load().then(() => {
        track.addPageAction('loadedPackage', {
          packageType: 'plugin',
          packageName: pluginObj.id,
        })
      })
    }))
  }

  update () {
    return this.updateTheme().then(() => {
      return this.updatePlugins()
    })
  }

  updateTheme () {
    return this.theme.update()
  }

  updatePlugins () {
    return Promise.all(this.plugins.map((plugin) => {
      return plugin.update()
    }))
  }

  resetQuery () {
    this.query = ''
    this.emitQueryChange()
    this.clearResults()
  }

  setQuery (query) {
    this.query = query
    this.emitQueryChange()
    let first = true
    const interaction = track.interaction()
    interaction.setName('search')
    interaction.setAttribute('query', query)

    const promises = this.plugins.filter((plugin) => {
      return plugin.respondsTo(query)
    }).reduce((memo, plugin) => {
      const tracer = track.tracer(plugin.id)
      const pluginPromises = plugin.search(query)
      Promise.all(pluginPromises).then(tracer.complete).catch(tracer.error)
      return memo.concat(pluginPromises)
    }, [])

    promises.map((promise) => {
      return promise.then((results = []) => {
        if (query === this.query) {
          if (first) {
            first = false
            this.clearResults()
          }
          this.results = this.results.concat(results)
          this.emitResultChange()
        }
      })
    })

    Promise.all(promises).then(() => {
      interaction.save()
    }).catch(() => {
      interaction.save()
    })

    if (promises.length === 0) {
      this.clearResults()
    }
  }

  clearResults () {
    this.results = []
    this.emitResultChange()
  }

  emitThemeChange (css) {
    this.emit(CHANGE_THEME_EVENT, css)
  }

  addThemeListener (callback) {
    this.on(CHANGE_THEME_EVENT, callback)
  }

  removeThemeListener (callback) {
    this.removeListener(CHANGE_THEME_EVENT, callback)
  }

  emitQueryChange () {
    this.emit(CHANGE_QUERY_EVENT, this.query)
  }

  addQueryListener (callback) {
    this.on(CHANGE_QUERY_EVENT, callback)
  }

  removeQueryListener (callback) {
    this.removeListener(CHANGE_QUERY_EVENT, callback)
  }

  emitResultChange () {
    this.emit(CHANGE_RESULTS_EVENT, this.results)
  }

  addResultListener (callback) {
    this.on(CHANGE_RESULTS_EVENT, callback)
  }

  removeResultListener (callback) {
    this.removeListener(CHANGE_RESULTS_EVENT, callback)
  }
}

var pluginStore = new PluginStore()

module.exports = pluginStore
