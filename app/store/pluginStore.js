const EventEmitter = require('events')

const configuration = require('../configuration')
const Plugin = require('../plugin')
const globalEmitter = require('../lib/globalEmitter')

const CHANGE_EVENT = 'change'

class PluginStore extends EventEmitter {
  constructor () {
    super()
    this.query = ''
    this.results = []
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
    this.results = []
    this.emitChange()
    this.plugins.forEach((plugin) => {
      if (!plugin.respondsTo(this.query)) { return }
      plugin.search(this.query).forEach((promise) => {
        promise.then((results) => {
          if (query !== this.query) { return }
          this.results = this.results.concat(results)
          this.emitChange()
        })
      })
    })
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
