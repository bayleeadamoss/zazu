const React = require('react')

const Result = React.createClass({

  propTypes: {
    active: React.PropTypes.bool.isRequired,
    value: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
    handleTab: React.PropTypes.func.isRequired,
  },

  click () {
    this.props.onClick(this.props.value)
  },

  handleFocus () {
    this.props.handleTab(this.props.value)
  },

  shouldComponentUpdate (nextProps) {
    return nextProps.active !== this.props.active ||
      nextProps.value !== this.props.value ||
      nextProps.onClick !== this.props.onClick
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

  renderIcon () {
    const { value } = this.props
    const isFontAwesome = value.icon.indexOf('fa-') === 0 && value.icon.indexOf('.') === -1

    if (isFontAwesome) {
      return <i className={'icon fa' + value.icon} aria-hidden='true'/>
    } else {
      return <img className='icon' src={value.icon} role='presentation' alt=''/>
    }
  },

  render () {
    const { active, value } = this.props

    return (
      <li
        onClick={this.click}
        className={active ? 'active' : 'inactive'}
        ref={this.setReference}
        tabIndex={0}
        onFocus={this.handleFocus}>
        {this.renderIcon()}
        <h2>{value.title}</h2>
        <h3>{value.subtitle}</h3>
      </li>
    )
  },
})

module.exports = Result
