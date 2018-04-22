const React = require('react')
const PropTypes = require('prop-types')

const Plugin = require('../packages/plugin')
const Theme = require('../packages/theme')
const track = require('../lib/track')
const globalEmitter = require('../lib/globalEmitter')
const notification = require('../lib/notification')
const truncateResult = require('../lib/truncateResult')
const DatabaseWrapper = require('./databaseWrapper')
const LoadingSpinner = require('../components/loadingSpinner.js')
const NoPlugins = require('../components/noplugins.js')

class PluginWrapper extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      loaded: 0,
      query: '',
      theme: '',
      results: [],
      plugins: [],
      activePlugin: null,
      activeBlock: null,
    }
  }

  scopeBlock = (activePlugin, activeBlock) => {
    this.context.logger.log('info', 'scoping block', { activePlugin, activeBlock })
    if (!activePlugin) {
      this.state.plugins.forEach((plugin) => {
        plugin.setActive(true)
      })
    } else {
      this.state.plugins.forEach((plugin) => {
        plugin.setScoped(plugin.id === activePlugin, activeBlock)
      })
    }
  }

  componentWillMount () {
    globalEmitter.on('updatePlugins', this.updatePackages)
    this.loadPackages()
  }

  componentWillUnmount () {
    globalEmitter.removeListener('updatePlugins', this.updatePackages)
  }

  updatePackages = () => {
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
  }

  clearResults = () => {
    this.context.logger.log('info', 'clearing results')
    this.setState({
      results: [],
    })
  }

  loadPackages = () => {
    return this.loadTheme().then(() => {
      return this.loadPlugins()
    }).catch(() => {
      notification.push({
        title: 'No Plugins',
        message: 'There are no plugins to load',
      })
    })
  }

  loadTheme = () => {
    const { configuration } = this.context
    const theme = new Theme(configuration.theme, configuration.pluginDir)
    return theme.load().then(() => {
      this.setState({ theme })
      track.addPageAction('loadedPackage', {
        packageType: 'theme',
        packageName: theme.url,
      })
    })
  }

  loadPlugins = () => {
    const { configuration } = this.context
    const plugins = configuration.plugins.map((plugin) => {
      if (typeof plugin === 'object') {
        return new Plugin(plugin.name, plugin.variables)
      } else {
        return new Plugin(plugin)
      }
    })
    this.setState({ plugins, loaded: 0 })
    if (plugins.length === 0) {
      this.context.logger.log('info', 'no plugins to load')
      throw new Error('no plugins to load')
    }
    return Promise.all(plugins.map((pluginObj) => {
      return pluginObj.load().then(() => {
        const loaded = this.state.loaded + 1
        this.setState({
          loaded,
        })
        track.addPageAction('loadedPackage', {
          packageType: 'plugin',
          packageName: pluginObj.id,
        })
      }, reason => {
        this.context.logger.log('error', 'failed to load plugin', reason)
      })
    })).then(() => {
      this.context.logger.log('info', 'plugins are loaded')
    }, reason => {
      this.context.logger.log('error', 'plugins NOT loaded', reason)
    })
  }

  handleResetQuery = () => {
    if (this.context.configuration.debug) return
    this.setState({
      query: '',
      results: [],
    })
  }

  handleQueryChange = (query) => {
    const newResults = this.state.plugins.reduce((oldResults, plugin) => {
      const pluginName = plugin.id
      const searchResults = plugin.search(query)
      const respondedBlocks = Object.keys(searchResults)

      // 1. when input resolves replace it's results
      respondedBlocks.map((blockId) => {
        const inputPromise = searchResults[blockId]
        return inputPromise.then((results = []) => {
          if (query !== this.state.query) return
          // 2. Remove old block results
          const filteredResults = this.state.results.filter((result) => {
            const isPlugin = result.pluginName === pluginName
            const isBlock = result.blockId === blockId
            return !(isPlugin && isBlock)
          })

          // 3. Add new block results
          this.setState({
            results: filteredResults.concat(results),
          })
        })
      })

      // 4. delete inputs that didn't respond
      return oldResults.filter((result) => {
        if (result.pluginName !== pluginName) return true
        return respondedBlocks.includes(result.blockId)
      })
    }, this.state.results)

    this.setState({
      results: newResults,
      query,
    })
  }

  handleResultClick = (result) => {
    this.context.logger.log('info', 'actioned result', truncateResult(result))
    const interaction = track.interaction()
    interaction.setName('actioned')
    result.next().then(() => {
      interaction.save()
    }).catch(() => {
      interaction.save()
    })
  }

  render () {
    const { query, theme, results } = this.state
    const noPlugins = this.state.plugins.length === 0
    const stillLoading = this.state.loaded !== this.state.plugins.length
    if (stillLoading) {
      return (
        <LoadingSpinner
          loaded={this.state.loaded}
          total={this.state.plugins.length}/>
      )
    }

    if (noPlugins) {
      return (
        <NoPlugins/>
      )
    }

    return (
      <DatabaseWrapper
        query={query}
        theme={theme && theme.css}
        results={results}
        scopeBlock={this.scopeBlock}
        handleResetQuery={this.handleResetQuery}
        handleQueryChange={this.handleQueryChange}
        handleResultClick={this.handleResultClick}/>
    )
  }
}

PluginWrapper.contextTypes = {
  configuration: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
}

module.exports = PluginWrapper
