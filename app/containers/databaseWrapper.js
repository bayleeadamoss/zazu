const React = require('react')
const PropTypes = require('prop-types')

const path = require('path')
const Datastore = require('nestdb')

const Zazu = require('./zazu')
const track = require('../lib/track')
const resultSorter = require('../transforms/resultSorter')

class DatabaseWrapper extends React.Component {
  constructor (props, context) {
    super(props, context)

    const { configuration } = this.context
    const databasePath = path.join(configuration.databaseDir, 'track.nedb')
    this.state = {
      clickedResults: [],
      database: new Datastore({ filename: databasePath, autoload: true }),
    }
  }

  componentWillMount () {
    this.state.database.find({}).exec((err, clickedResults) => {
      if (err) return
      this.setState({
        clickedResults,
      })
    })
  }

  trackClick = (clickedResult) => {
    track.addPageAction('clickedResult', {
      pluginName: clickedResult.pluginName,
    })
    this.setState({
      clickedResults: [...this.state.clickedResults].concat(clickedResult),
    })
    this.state.database.insert(clickedResult)
  }

  handleResultClick = (result) => {
    this.trackClick({
      id: result.id,
      pluginName: result.pluginName,
    })
    this.props.handleResultClick(result)
  }

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
  }
}

DatabaseWrapper.propTypes = {
  query: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
  handleResultClick: PropTypes.func.isRequired,
  handleResetQuery: PropTypes.func.isRequired,
  scopeBlock: PropTypes.func.isRequired,
}

DatabaseWrapper.contextTypes = {
  configuration: PropTypes.object.isRequired,
}

module.exports = DatabaseWrapper
