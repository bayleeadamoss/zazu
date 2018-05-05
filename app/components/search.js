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
const successive = require('../lib/successive')

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
    this.state = { input: null, searchQuery: '', history: [] }
  }

  selectAll = _ => {
    if (this.state.historyId === -1 || !this.state.input) return
    this.state.input.select()
  }

  focus = _ => this.state.input && this.state.input.focus()

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
    this.props.handleQueryChange(this.state.history[historyId])
    this.setState({ historyId })
  }

  handleNextSearch = () => {
    const historyId = this.state.historyId - 1
    this.props.handleQueryChange(this.state.history[historyId])
    this.setState({ historyId })
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

    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js#answer-24679479
    this.handleQueryChange = t => successive.deflect(_ => t.props.handleQueryChange(t.state.searchQuery), 100)
    this.onChange = event => {
      if (event.target) {
        const searchQuery = event.target.value || ''
        this.setState({ searchQuery })
        this.handleQueryChange(this)
      }
    }

    this.focus()
  }

  componentWillUnmount = _ => {
    globalEmitter.removeListener('hideWindow', this.handleSaveQuery)
    keyboard.unbind('search')
  }

  componentDidUpdate = _ => this.state.searchQuery === '' && this.focus()

  setReference       = input => this.setState({ input })
  openMenu           = _ => menu.popup()
  renderMenuToggle = _ => <button onClick={this.openMenu} className='menuToggle fa fa-cog' />

  render () {
    return (
      <div className="searchInputWrapper">
        <input
          title='Search Zazu'
          className='mousetrap'
          ref={this.setReference}
          type='text'
          onChange={this.onChange}
        />
        {configuration.hideTrayItem ? this.renderMenuToggle() : null}
        <Style css={css} />
      </div>
    )
  }
}

Search.propTypes = { value: PropTypes.string.isRequired, handleQueryChange: PropTypes.func.isRequired, }

module.exports = Search
