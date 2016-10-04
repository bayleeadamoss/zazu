/* global React, ReactDOM, fuzzyfind */

function packagesToResults (packages) {
  return packages.map(function packageToResult(package) {
    return {
      title: package.title,
      url: 'https://github.com/' + package.githuburl,
      icon: package.image,
      subtitle: package.description,
      type: 'packages',
    }
  })
}

function docsToResults (docs) {
  return docs.map(function docToResult(doc) {
    return {
      title: doc.title,
      url: doc.url,
      icon: doc.icon,
      subtitle: doc.content,
      type: 'docs',
    }
  })
}


var SearchForm = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    handleUpdateQuery: React.PropTypes.func.isRequired,
  },
  handleUpdateQuery: function (e) {
    this.props.handleUpdateQuery(e.target.value)
  },
  render: function () {
    return React.createElement(
      'div', {}, React.createElement(
        'input',
        {
          placeholder: 'Search...',
          value: this.props.query,
          onChange: this.handleUpdateQuery,
        }
      )
    )
  },
})

var Result = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    subtitle: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
  },
  render: function () {
    const { url, icon, title, subtitle, type } = this.props
    const hasFontAwesome = icon.indexOf('fa-') === 0
    return React.createElement(
      'div',
      { key: url, className: type },
      React.createElement(
        'h2',
        {},
        hasFontAwesome ? (
          React.createElement('i', { className: 'fa ' + icon })
        ) : (
          React.createElement('img', { src: icon })
        ),
        React.createElement('a', { href: url }, title)
      ),
      React.createElement('p', {}, subtitle)
    )
  },
})

var SearchPage = React.createClass({
  propTypes: {
    docs: React.PropTypes.array.isRequired,
    packages: React.PropTypes.array.isRequired,
  },

  getInitialState: function () {
    return {
      query: '',
    }
  },

  handleUpdateQuery: function (query) {
    this.setState({
      query: query,
    })
  },

  render: function () {
    var docs = docsToResults(this.props.docs)
    var package = packagesToResults(this.props.packages)
    var results = docs.concat(package)
    var filteredResults = fuzzyfind(this.state.query, results, {
      accessor: function (el) {
        return el.title + el.subtitle
      },
    })
    return React.createElement(
      'div',
      {},
      React.createElement(SearchForm, {
        query: this.state.query,
        handleUpdateQuery: this.handleUpdateQuery,
      }),
      filteredResults.map(function renderResult(result, i) {
        result.key = i
        return React.createElement(Result, result)
      })
    )
  },
})

ReactDOM.render(
  React.createElement(SearchPage, {
    docs: window.site.docs,
    packages: window.site.packages,
  }),
  document.getElementById('search')
)
