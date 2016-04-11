import Plugin from './plugin'
import Theme from './theme'
import configuration from './configuration'

export default class Zazu {
  constructor () {
    configuration.load()
    this.plugins = configuration.plugins.map((gitUrl) => {
      const plugin = new Plugin(gitUrl, configuration.pluginDir)
      plugin.load()
      return plugin
    })
  }

  loadTheme () {
    const theme = new Theme(configuration.theme, configuration.pluginDir)
    return theme.load()
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
