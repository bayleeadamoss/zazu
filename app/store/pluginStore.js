const EventEmitter = require('events')

const configuration = require('../configuration')
const Plugin = require('../plugin')
const track = require('../lib/track')

const CHANGE_RESULTS_EVENT = 'results_change'
const CHANGE_QUERY_EVENT = 'query_change'

class PluginStore extends EventEmitter {
  constructor () {
    super()
    this.query = ''
    this.results = []
    this.plugins = []
  }

  load () {
    configuration.load()
    this.plugins = configuration.plugins.map((plugin) => {
      let pluginObj
      if (typeof plugin === 'object') {
        pluginObj = new Plugin(plugin.name, plugin.variables)
      } else {
        pluginObj = new Plugin(plugin)
      }
      pluginObj.load()
      return pluginObj
    })
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
          this.emitChange()
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
    this.emitChange()
  }

  emitQueryChange () {
    this.emit(CHANGE_QUERY_EVENT)
  }

  addQueryListener (callback) {
    this.on(CHANGE_QUERY_EVENT, callback)
  }

  removeQueryListener (callback) {
    this.removeListener(CHANGE_QUERY_EVENT, callback)
  }

  emitChange () {
    this.emit(CHANGE_RESULTS_EVENT)
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
