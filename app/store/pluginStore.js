import EventEmitter from 'events'

import configuration from '../configuration'
import Plugin from '../plugin'

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
          console.log(query, this.query)
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
export default pluginStore
