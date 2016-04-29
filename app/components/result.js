import React from 'react'

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
        { value.name }
      </li>
    )
  },
})

export default Result
