/* global React, ReactDOM, fuzzyfind */

function packagesToResults (packages) {
  return packages.map(function packageToResult (pack) {
    return {
      title: pack.title,
      url: 'https://github.com/' + pack.githuburl,
      icon: pack.image,
      subtitle: pack.description,
      type: 'packages',
    }
  })
}

function docsToResults (docs) {
  return docs.map(function docToResult (doc) {
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
    handleFocus: React.PropTypes.func.isRequired,
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
          onFocus: this.props.handleFocus,
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

  handleClick: function () {
    window.location.href = this.props.url
  },

  render: function () {
    var hasFontAwesome = this.props.icon.indexOf('fa-') === 0
    return React.createElement(
      'div',
      {
        key: this.props.url,
        className: this.props.type + ' result',
        onClick: this.handleClick,
      },
      React.createElement(
        'h2',
        {},
        hasFontAwesome ? (
          React.createElement('i', { className: 'fa ' + this.props.icon })
        ) : (
          React.createElement('img', { src: this.props.icon })
        ),
        React.createElement('a', { href: this.props.url }, this.props.title)
      ),
      React.createElement('p', {}, this.props.subtitle)
    )
  },
})

var SearchPage = React.createClass({
  getInitialState: function () {
    return {
      docs: [],
      packages: [],
      query: '',
      fetched: false,
      focused: false,
    }
  },

  handleUpdateDocs: function (docs) {
    this.setState({
      docs: docs,
    })
  },

  handleUpdatePackages: function (packages) {
    this.setState({
      packages: packages,
    })
  },

  handleUpdateQuery: function (query) {
    this.setState({
      query: query,
    })
  },

  handleFocus: function () {
    this.setState({
      focused: true,
    })
    if (!this.state.fetched) {
      fetch('/api/docs.json').then(function (response) {
        return response.json()
      }).then(function (response) {
        return response.docs
      }).then(this.handleUpdateDocs)

      fetch('/api/packages.json').then(function (response) {
        return response.json()
      }).then(function (response) {
        return response.packages
      }).then(this.handleUpdatePackages)

      this.setState({
        fetched: true,
      })
    }
  },

  componentWillMount: function () {
    window.document.addEventListener('click', this.onClickOutside, false)
  },

  componentWillUnmount: function () {
    window.document.removeEventListener('click', this.onClickOutside)
  },

  onClickOutside: function (event) {
    const el = ReactDOM.findDOMNode(this)
    if (!el || el.contains(event.target)) { return }
    this.setState({
      focused: false,
    })
  },

  render: function () {
    var query = this.state.query
    var docs = docsToResults(this.state.docs)
    var packages = packagesToResults(this.state.packages)
    var results = query.length > 0 ? docs.concat(packages) : []
    var filteredResults = fuzzyfind(query, results, {
      accessor: function accessor (el) {
        return el.title + el.subtitle
      },
    })
    return React.createElement(
      'div',
      { className: 'searchContainer ' + (this.state.focused && 'focused') },
      React.createElement(SearchForm, {
        query: query,
        handleUpdateQuery: this.handleUpdateQuery,
        handleFocus: this.handleFocus,
      }),
      filteredResults.map(function renderResult (result, i) {
        result.key = i
        return React.createElement(Result, result)
      })
    )
  },
})

ReactDOM.render(
  React.createElement(SearchPage),
  document.getElementById('search')
)
