const path = require('path')

const Input = require('./blocks/input/index')
const Output = require('./blocks/output/index')
const notification = require('./lib/notification')
const Package = require('./package')

class Plugin extends Package {
  constructor (url, options = {}) {
    super(url)
    this.inputs = []
    this.outputs = []
    this.options = options
    this.loaded = false
  }

  load () {
    return super.load().then((plugin) => {
      this.loaded = true
      this.plugin = plugin
      plugin.blocks.input.forEach((input) => {
        input.cwd = this.path
        this.addInput(new Input[input.type](input))
      })

      plugin.blocks.output.forEach((output) => {
        output.cwd = this.path
        this.addOutput(new Output[output.type](output))
      })
    }).catch((errorMessage) => {
      notification.push({
        title: 'Plugin failed',
        message: errorMessage,
      })
    })
  }

  addInput (input) {
    this.inputs.push(input)
  }

  addOutput (input) {
    this.outputs.push(input)
  }

  respondsTo (inputText) {
    if (!this.loaded) { return }
    return this.inputs.find((input) => {
      return input.respondsTo(inputText)
    })
  }

  next (state) {
    const previousBlock = this.inputs.find((input) => {
      return input.id === state.blockId
    })
    if (!previousBlock) { return }
    previousBlock.connections.forEach((nextBlockId) => {
      const nextBlock = this.outputs.find((output) => {
        return output.id === nextBlockId
      })
      state.blockId = nextBlockId
      nextBlock.call(state)
    })
  }

  search (inputText) { // TODO: high complexity
    return this.inputs.reduce((responsePromises, input) => {
      if (input.respondsTo(inputText)) {
        responsePromises.push(input.call(inputText, this.options).then((results) => {
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
