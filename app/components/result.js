const React = require('react')

const Result = React.createClass({

  propTypes: {
    active: React.PropTypes.bool.isRequired,
    value: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },

  click () {
    this.props.onClick(this.props.value)
  },

  componentDidUpdate () {
    if (this.props.active) {
      const list = this.el.parentElement
      const listTop = list.offsetTop
      const listHeight = list.offsetHeight
      const elementTop = this.el.getBoundingClientRect().top - listTop
      const elementBottom = elementTop + this.el.offsetHeight
      if (listHeight < elementBottom) {
        this.el.scrollIntoView(false)
      } else if (elementTop < 0) {
        this.el.scrollIntoView(true)
      }
    }
  },

  setReference (el) {
    this.el = el
  },

  render () {
    const { active, value } = this.props
    const isFontAwesome = value.icon.indexOf('fa-') === 0 && value.icon.indexOf('.') === -1
    return React.createElement(
      'li',
      {
        onClick: this.click,
        className: active ? 'active' : 'inactive',
        ref: this.setReference,
      },
      isFontAwesome ? (
        React.createElement('i', {
          className: 'icon fa ' + value.icon,
          'aria-hidden': 'true',
        })
      ) : (
        React.createElement('img', {
          className: 'icon',
          src: value.icon,
          alt: '',
        })
      ),
      React.createElement('h2', null, value.title),
      value.subtitle && React.createElement('h3', null, value.subtitle)
    )
  },
})

module.exports = Result
