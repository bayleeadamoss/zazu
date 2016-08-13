const React = require('react')

const Plugin = require('../packages/plugin')
const Theme = require('../packages/theme')
const track = require('../lib/track')
const globalEmitter = require('../lib/globalEmitter')
const notification = require('../lib/notification')
const configuration = require('../lib/configuration')
const DatabaseWrapper = require('./databaseWrapper')

const PluginWrapper = React.createClass({

  getInitialState () {
    return {
      query: '',
      theme: '',
      results: [],
      activePlugin: null,
      activeBlock: null,
    }
  },

  scopeBlock (activePlugin, activeBlock) {
    if (!activePlugin) {
      this.state.plugins.forEach((plugin) => {
        plugin.setActive(true)
      })
    } else {
      this.state.plugins.forEach((plugin) => {
        plugin.setScoped(plugin.id === activePlugin, activeBlock)
      })
    }
  },

  componentWillMount () {
    globalEmitter.on('updatePlugins', this.updatePackages)
    this.loadPackages()
  },

  componentWillUnmount () {
    globalEmitter.removeListener('updatePlugins', this.updatePackages)
  },

  updatePackages () {
    return this.state.theme.update().then(() => {
      return this.loadTheme()
    }).then(() => {
      return Promise.all(this.state.plugins.map((plugin) => {
        return plugin.update()
      }))
    }).then(() => {
      return this.loadPlugins()
    }).then(() => {
      notification.push({
        title: 'Plugins reloaded',
        message: 'Your plugins have been reloaded',
      })
    })
  },

  clearResults () {
    this.setState({
      results: [],
    })
  },

  loadPackages () {
    configuration.load()
    return this.loadTheme().then(() => {
      return this.loadPlugins()
    }).then(() => {
      notification.push({
        title: 'Plugins loaded',
        message: 'Your plugins have been loaded',
      })
    })
  },

  loadTheme () {
    const theme = new Theme(configuration.theme, configuration.pluginDir)
    return theme.load().then((plugin) => {
      this.setState({ theme })
      track.addPageAction('loadedPackage', {
        packageType: 'theme',
        packageName: plugin.url,
      })
    })
  },

  loadPlugins () {
    const plugins = configuration.plugins.map((plugin) => {
      if (typeof plugin === 'object') {
        return new Plugin(plugin.name, plugin.variables)
      } else {
        return new Plugin(plugin)
      }
    })
    this.setState({ plugins })
    return Promise.all(plugins.map((pluginObj) => {
      return pluginObj.load().then(() => {
        track.addPageAction('loadedPackage', {
          packageType: 'plugin',
          packageName: pluginObj.id,
        })
      })
    }))
  },

  handleResetQuery () {
    if (configuration.debug) return
    this.setState({
      query: '',
      results: [],
    })
  },

  handleQueryChange (query) {
    let first = true
    const interaction = track.interaction()
    interaction.setName('search')
    interaction.setAttribute('queryLength', query.length)

    const promises = this.state.plugins.filter((plugin) => {
      return plugin.respondsTo(query)
    }).reduce((memo, plugin) => {
      const tracer = track.tracer(plugin.id)
      const pluginPromises = plugin.search(query)
      Promise.all(pluginPromises).then(tracer.complete).catch(tracer.error)
      return memo.concat(pluginPromises)
    }, [])

    promises.map((promise) => {
      return promise.then((results = []) => {
        if (query === this.state.query) {
          if (first) {
            first = false
            this.setState({
              results,
            })
          } else {
            this.setState({
              results: [...this.state.results].concat(results),
            })
          }
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

    this.setState({
      query,
    })
  },

  handleResultClick (result) {
    const interaction = track.interaction()
    interaction.setName('actioned')
    result.next().then(() => {
      interaction.save()
    }).catch(() => {
      interaction.save()
    })
  },

  render () {
    const { query, theme, results } = this.state
    return React.createElement(DatabaseWrapper, {
      query,
      theme: theme && theme.css,
      results,
      scopeBlock: this.scopeBlock,
      handleResetQuery: this.handleResetQuery,
      handleQueryChange: this.handleQueryChange,
      handleResultClick: this.handleResultClick,
    })
  },
})

module.exports = PluginWrapper
