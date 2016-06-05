const React = require('react')

const Result = React.createClass({

  propTypes: {
    active: React.PropTypes.bool.isRequired,
    value: React.PropTypes.object.isRequired,
    activate: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },

  click () {
    this.props.onClick(this.props.value)
  },

  activate () {
    this.props.activate(this.props.value)
  },

  render () {
    const { active, value } = this.props
    return React.createElement(
      'li',
      {
        onClick: this.click,
        onMouseOver: this.activate,
        className: active ? 'active' : 'inactive',
      },
      React.createElement('img', { src: value.icon, alt: '' }),
      React.createElement('h2', null, value.title),
      value.subtitle && React.createElement('h3', null, value.subtitle)
    )
  },
})

module.exports = Result
