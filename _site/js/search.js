/* global React, ReactDOM, lunr */

function queryString () {
  return window.location.hash.slice(1).split('&').reduce(function (qs, item) {
    var key = item.split('=')[0]
    var value = decodeURIComponent(item.split('=')[1])
    qs[key] = value
    return qs
  }, {})
}

var NoResults = React.createClass({
  render: function () {
    return React.createElement('div', {}, 'No results were found.')
  },
})

var Search = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    handleUpdateQuery: React.PropTypes.func.isRequired,
    handleUpdateType: React.PropTypes.func.isRequired,
  },
  handleUpdateQuery: function (e) {
    this.props.handleUpdateQuery(e.target.value)
  },
  handleUpdateType: function (e) {
    this.props.handleUpdateType(e.target.value)
  },
  render: function () {
    return React.createElement(
      'div',
      {},
      React.createElement(
        'input',
        {
          placeholder: 'Search...',
          value: this.props.query,
          onChange: this.handleUpdateQuery,
        }
      ),
      React.createElement(
        'select',
        {
          value: this.props.type,
          onChange: this.handleUpdateType,
        },
        ['Any', 'Docs', 'Package'].map((type) => {
          return React.createElement('option', { key: type, value: type }, type)
        })
      )
    )
  },
})

var DocResults = React.createClass({
  propTypes: {
    docs: React.PropTypes.array.isRequired,
  },
  render: function () {
    return React.createElement(
      'div',
      {},
      React.createElement('h2', {}, 'Documentation'),
      this.props.docs.map(function (doc) {
        return React.createElement(
          'div',
          { className: 'docs', key: doc.url },
          React.createElement(
            'h2',
            {},
            React.createElement('i', { className: 'fa ' + doc.icon }),
            React.createElement('a', { href: doc.url }, doc.title)
          ),
          React.createElement('p', {}, doc.content)
        )
      })
    )
  },
})

var PackageResults = React.createClass({
  propTypes: {
    docs: React.PropTypes.array.isRequired,
  },
  render: function () {
    return React.createElement(
      'div',
      {},
      React.createElement('h2', {}, 'Packages'),
      this.props.docs.map(function (doc) {
        return React.createElement(
          'a',
          {
            key: doc.githuburl,
            className: 'package ' + doc.type,
            href: 'https://github.com/' + doc.githuburl,
          },
          React.createElement('img', {
            src: doc.image,
            alt: doc.title + ' Logo',
          }),
          React.createElement('h2', {}, doc.title),
          React.createElement('p', {}, doc.description)
        )
      })
    )
  },
})

var SearchPage = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    docs: React.PropTypes.array.isRequired,
    packages: React.PropTypes.array.isRequired,
    handleUpdateQuery: React.PropTypes.func.isRequired,
    handleUpdateType: React.PropTypes.func.isRequired,
  },
  results: function (query, collection) {
    if (query === '') {
      return collection.sort(function () {
        return Math.floor(Math.random() * 3) - 1
      })
    }
    var index = lunr(function () {
      var attributes = Object.keys(collection[0])
      var attribute
      while (attribute = attributes.pop()) {
        if (attribute === 'title') {
          this.field(attribute, { boost: 10 })
        } else {
          this.field(attribute)
        }
      }
      this.ref('title')
    })
    collection.map(function (doc) { index.add(doc) })
    return index.search(query).map((index) => {
      const title = index.ref
      return collection.find(function (doc) {
        return title === doc.title
      })
    })
  },
  render: function () {
    var docs = this.props.type !== 'Package' ? this.results(this.props.query, this.props.docs) : []
    var packages = this.props.type !== 'Docs' ? this.results(this.props.query, this.props.packages) : []
    var results
    if (docs.length + packages.length === 0) {
      results = React.createElement(NoResults)
    } else {
      results = [
        docs.length > 0 && React.createElement(DocResults, {
          key: 'docs',
          docs: docs.slice(0, 3),
        }),
        packages.length > 0 && React.createElement(PackageResults, {
          key: 'packages',
          docs: packages.slice(0, 3),
        }),
      ]
    }
    return React.createElement(
      'div',
      {},
      React.createElement(Search, {
        query: this.props.query,
        type: this.props.type,
        handleUpdateQuery: this.props.handleUpdateQuery,
        handleUpdateType: this.props.handleUpdateType,
      }),
      results
    )
  },
})

var SearchRouter = React.createClass({
  propTypes: {
    docs: React.PropTypes.array.isRequired,
    packages: React.PropTypes.array.isRequired,
  },
  getInitialState: function () {
    var qs = queryString()
    return {
      query: qs.query || '',
      type: qs.type || 'Any',
    }
  },
  componentDidMount: function () {
    window.addEventListener('hashchange', this.handleUpdateHash, false)
  },
  componentWillUnmount: function () {
    window.removeEventListener('hashchange', this.handleUpdateHash)
  },
  handleUpdateHash: function () {
    var qs = queryString()
    this.setState({
      query: qs.query || '',
      type: qs.type || 'Any',
    })
  },
  handleUpdateQuery: function (query) {
    var qs = queryString()
    window.location.hash = 'query=' + encodeURIComponent(query) + '&type=' + qs.type
  },
  handleUpdateType: function (type) {
    var qs = queryString()
    window.location.hash = 'query=' + encodeURIComponent(qs.query) + '&type=' + type
  },
  render: function () {
    return React.createElement(SearchPage, {
      docs: this.props.docs,
      packages: this.props.packages,
      query: this.state.query,
      type: this.state.type,
      handleUpdateQuery: this.handleUpdateQuery,
      handleUpdateType: this.handleUpdateType,
    })
  },
})

ReactDOM.render(
  React.createElement(SearchRouter, {
    docs: window.site.docs,
    packages: window.site.packages,
  }),
  document.getElementById('search')
)
