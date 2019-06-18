const React = require('react')
const PropTypes = require('prop-types')
const { remote } = require('electron')
const { Menu } = remote

const configuration = require('../lib/configuration')
const globalEmitter = require('../lib/globalEmitter')
const keyboard = require('../lib/keyboard')
const mergeUnique = require('../lib/mergeUnique')
const { menuTemplate } = require('../helpers/menu')
const Style = require('./style')

const menu = Menu.buildFromTemplate(menuTemplate)

const css = `
  .searchInputWrapper {
    position: relative;
  }
  .menuToggle {
    position: absolute;
    bottom: 3px;
    right: 4px;
    padding: 0;
    background: transparent;
    border: none;
    color: #545454;
  }
  .menuToggle::before {
    cursor: pointer;
  }
`

class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      input: null,
      history: [],
    }
  }

  selectAll = () => {
    if (this.state.historyId === -1 || !this.state.input) return
    this.state.input.select()
  }

  focus = () => {
    this.state.input && this.state.input.focus()
  }

  handleSaveQuery = () => {
    if (!this.props.value) return
    const haystack = mergeUnique(this.props.value, this.state.history)
    this.setState({
      historyId: -1,
      history: haystack.slice(0, 10),
    })
  }

  canTraverseValue = () => {
    const { input } = this.state
    if (!input) return false
    const hasNoText = input.value.length === 0
    const isFullySelected = input.selectionStart !== input.selectionEnd
    return hasNoText || isFullySelected
  }

  handlePreviousSearch = () => {
    const historyId = this.state.historyId + 1
    this.props.handleQueryChange(this.state.history[historyId] || '')
    this.setState({
      historyId,
    })
  }

  handleNextSearch = () => {
    const historyId = this.state.historyId - 1
    this.props.handleQueryChange(this.state.history[historyId] || '')
    this.setState({
      historyId,
    })
  }

  componentDidMount = () => {
    globalEmitter.on('hideWindow', this.handleSaveQuery)
    keyboard.bind('search', 'up', () => {
      if (this.canTraverseValue()) {
        this.handlePreviousSearch()
      }
    })
    keyboard.bind('search', 'down', () => {
      if (this.canTraverseValue()) {
        this.handleNextSearch()
      }
    })
    this.focus()
  }

  componentWillUnmount = () => {
    globalEmitter.removeListener('hideWindow', this.handleSaveQuery)
    keyboard.unbind('search')
  }

  componentDidUpdate = () => {
    if (this.props.value === '') {
      this.focus()
    }
    this.selectAll()
  }

  handleQueryChange = (event) => {
    const query = event.target.value
    this.props.handleQueryChange(query)
    this.setState({
      historyId: -1,
    })
  }

  setReference = (input) => {
    this.setState({
      input,
    })
  }

  openMenu = () => {
    menu.popup()
  }

  renderMenuToggle = () => (
    <button key="button" onClick={this.openMenu} className='menuToggle fa fa-cog' />
  )

  render () {
    const { value } = this.props

    return (
      <div className="searchInputWrapper">
        <input
          key="input"
          title='Search Zazu'
          className='mousetrap'
          ref={this.setReference}
          type='text'
          onChange={this.handleQueryChange}
          value={value} />
        {configuration.hideTrayItem ? this.renderMenuToggle() : null}
        <Style css={css} />
      </div>
    )
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
}

module.exports = Search
