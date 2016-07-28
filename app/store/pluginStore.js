const EventEmitter = require('events')

const configuration = require('../configuration')
const Plugin = require('../plugin')

const CHANGE_EVENT = 'change'

class PluginStore extends EventEmitter {
  constructor () {
    super()
    this.query = ''
    this.results = []
  }

  load () {
    configuration.load().then(() => {
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
    })
  }

  setQuery (query) {
    this.query = query
    let first = true
    const interaction = newrelic.interaction()
    interaction.setName('search')
    interaction.setAttribute('query', query)

    const promises = this.plugins.filter((plugin) => {
      return plugin.respondsTo(query)
    }).reduce((memo, plugin) => {
      const tracer = interaction.createTracer(plugin.id)
      const pluginPromises = plugin.search(query)
      Promise.all(pluginPromises).then(tracer).catch(tracer)
      return memo.concat(pluginPromises)
    }, [])

    promises.map((promise) => {
      return promise.then((results) => {
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
      interaction.ignore()
    })

    if (promises.length === 0) {
      this.clearResults()
    }
  }

  clearResults () {
    this.results = []
    this.emitChange()
  }

  emitChange () {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
}

var pluginStore = new PluginStore()
module.exports = pluginStore
