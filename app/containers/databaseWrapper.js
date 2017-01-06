const React = require('react')
const path = require('path')
const Datastore = require('nedb')

const Zazu = require('./zazu')
const track = require('../lib/track')
const resultSorter = require('../transforms/resultSorter')

const DatabaseWrapper = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    theme: React.PropTypes.string.isRequired,
    results: React.PropTypes.array.isRequired,
    handleQueryChange: React.PropTypes.func.isRequired,
    handleResultClick: React.PropTypes.func.isRequired,
    handleResetQuery: React.PropTypes.func.isRequired,
    scopeBlock: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    configuration: React.PropTypes.object.isRequired,
  },

  getInitialState () {
    const { configuration } = this.context
    const databasePath = path.join(configuration.databaseDir, 'track.nedb')
    return {
      clickedResults: [],
      database: new Datastore({ filename: databasePath, autoload: true }),
    }
  },

  componentWillMount () {
    this.state.database.find({}).exec((err, clickedResults) => {
      if (err) return
      this.setState({
        clickedResults,
      })
    })
  },

  trackClick (clickedResult) {
    track.addPageAction('clickedResult', {
      pluginName: clickedResult.pluginName,
    })
    this.setState({
      clickedResults: [...this.state.clickedResults].concat(clickedResult),
    })
    this.state.database.insert(clickedResult)
  },

  handleResultClick (result) {
    this.trackClick({
      id: result.id,
      pluginName: result.pluginName,
    })
    this.props.handleResultClick(result)
  },

  render () {
    const { handleQueryChange, handleResetQuery, query, theme, results, scopeBlock } = this.props
    return (
      <Zazu
        query={query}
        theme={theme}
        scopeBlock={scopeBlock}
        handleResetQuery={handleResetQuery}
        handleQueryChange={handleQueryChange}
        handleResultClick={this.handleResultClick}
        results={resultSorter.sort(results, this.state.clickedResults)}
        />
    )
  },
})

module.exports = DatabaseWrapper
