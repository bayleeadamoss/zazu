import Plugin from './plugin'
import configuration from './configuration'

export default class Zazu {
  constructor () {
    configuration.load()
    this.plugins = configuration.plugins.map((gitUrl) => {
      const plugin = new Plugin(gitUrl, configuration.pluginDir)
      plugin.downloadPlugin()
      return plugin
    })
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
}
