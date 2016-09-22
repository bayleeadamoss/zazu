/* global React, ReactDOM, fuzzyfind */

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
    content: React.PropTypes.string.isRequired,
  },
  render: function () {
    const { url, icon, title, content } = this.props
    const hasFontAwesome = icon.indexOf('fa-') === 0
    return React.createElement(
      'div',
      { key: url },
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
      React.createElement('p', {}, content)
    )
  },
})

var SearchPackages = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    packages: React.PropTypes.array.isRequired,
  },
  render: function () {
    const filteredResults = fuzzyfind(this.props.query, this.props.packages, {
      accessor: function (el) {
        return el.title + el.githuburl + el.description
      },
    })
    return React.createElement(
      'div',
      { className: 'packages' },
      filteredResults.map(function (el, i) {
        return React.createElement(Result, {
          key: i,
          title: el.title,
          url: 'https://github.com/' + el.githuburl,
          icon: el.image,
          content: el.description,
        })
      })
    )
  },
})

var SearchDocs = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    docs: React.PropTypes.array.isRequired,
  },
  render: function () {
    const filteredResults = fuzzyfind(this.props.query, this.props.docs, {
      accessor: function (el) {
        return el.title + el.content
      },
    })
    return React.createElement(
      'div',
      { className: 'docs' },
      filteredResults.map(function (el, i) {
        return React.createElement(Result, {
          key: i,
          title: el.title,
          url: el.url,
          icon: el.icon,
          content: el.content,
        })
      })
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
    return React.createElement(
      'div',
      {},
      React.createElement(SearchForm, {
        query: this.state.query,
        handleUpdateQuery: this.handleUpdateQuery,
      }),
      React.createElement(SearchDocs, {
        query: this.state.query,
        docs: this.props.docs,
      }),
      React.createElement(SearchPackages, {
        query: this.state.query,
        packages: this.props.packages,
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
