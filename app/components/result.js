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
    return (
      <li
        onClick={this.click}
        onMouseOver={this.activate}
        className={active ? 'active' : 'inactive'}>
        <img src={ value.icon } alt='' />
        <h2>{ value.title }</h2>
        <h3>{ value.subtitle }</h3>
      </li>
    )
  },
})

module.exports = Result
