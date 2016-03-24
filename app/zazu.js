export default class Zazu {
  constructor () {
    this.settings = {}
    this.plugins = []
  }

  search (input, callback) {
    let responses = []
    this.plugins.forEach((plugin) => {
      if (plugin.respondsTo(input)) {
        responses = responses.concat(plugin.search(input))
      }
    })
    callback(responses)
  }

  addSetting (name, value) {
    this.settings[name] = value
  }

  addPlugin (pluginObj) {
    this.plugins.push(pluginObj)
  }

  addSource () {}
  installPlugin () {}
  isPluginInstalled () {}
}
