import Input from './plugin/input/index'
import Output from './plugin/output/index'

export default class Plugin {
  constructor (path) {
    this.plugin = require(path)
    this.inputs = []
    this.outputs = []

    this.plugin.blocks.input.forEach((input) => {
      this.addInput(new Input[input.type](input))
    })

    this.plugin.blocks.output.forEach((output) => {
      this.addOutput(new Output[output.type](output))
    })
  }

  addInput (input) {
    this.inputs.push(input)
  }

  addOutput (input) {
    this.outputs.push(input)
  }

  respondsTo (inputText) {
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
        responsePromises.push(input.call(inputText).then((results) => {
          return results.map((result) => {
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
