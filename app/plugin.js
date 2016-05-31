const path = require('path')
const cuid = require('cuid')

const Input = require('./blocks/input')
const Output = require('./blocks/output')
const External = require('./blocks/external')
const notification = require('./lib/notification')
const globalEmitter = require('./lib/globalEmitter')
const Process = require('./lib/process')
const Package = require('./package')

class Plugin extends Package {
  constructor (url, options = {}) {
    super(url)
    this.id = cuid()
    this.inputs = []
    this.outputs = []
    this.blocksById = {}
    this.options = options
    this.loaded = false

    this.activeState = true
    globalEmitter.on('showWindow', (pluginId, blockId) => {
      this.activeState = !pluginId || this.id === pluginId
    })
  }

  load () {
    return super.load().then((plugin) => {
      this.loaded = true
      this.plugin = plugin
      plugin.blocks.external.forEach((external) => {
        this.addExternal(new External[external.type](external))
      })

      plugin.blocks.input.forEach((input) => {
        input.cwd = this.path
        input.pluginId = this.id
        this.addInput(new Input[input.type](input))
      })

      plugin.blocks.output.forEach((output) => {
        output.cwd = this.path
        output.pluginId = this.id
        this.addOutput(new Output[output.type](output))
      })
    }).catch((errorMessage) => {
      notification.push({
        title: 'Plugin failed',
        message: errorMessage,
      })
    })
  }

  addExternal (external) {
    external.on('actioned', () => {
      this.next({
        blockId: external.id,
      })
    })
  }

  addInput (input) {
    this.inputs.push(input)
    this.blocksById[input.id] = input
  }

  addOutput (output) {
    this.outputs.push(output)
    this.blocksById[output.id] = output
  }

  respondsTo (inputText) {
    if (!this.loaded || !this.activeState) { return }
    return this.inputs.find((input) => {
      return input.respondsTo(inputText)
    })
  }

  next (state) {
    const previousBlock = this.blocksById[state.blockId]
    previousBlock.connections.forEach((blockId) => {
      const nextBlock = this.blocksById[blockId]
      const nextState = Object.assign({}, state, { blockId })
      nextState.next = this.next.bind(this, nextState)
      nextBlock.call(nextState)
    })
  }

  search (inputText) {
    if (!this.loaded || !this.activeState) { return [] }
    return this.inputs.reduce((responsePromises, input) => {
      if (input.respondsTo(inputText)) {
        responsePromises.push(input.search(inputText, this.options).then((results) => {
          return results.map((result) => {
            result.icon = result.icon || path.join(this.path, this.plugin.icon)
            result.blockId = input.id
            result.next = this.next.bind(this, result)
            return result
          })
        }))
      }
      return responsePromises
    }, [])
  }
}

module.exports = Plugin
