import Input from './blocks/input/index'
import Output from './blocks/output/index'
import clone from 'git-clone'
import path from 'path'
import jetpack from 'fs-jetpack'
import notification from './lib/notification'

export default class Plugin {
  constructor (url, dir) {
    this.path = path.join(dir, url)
    this.inputs = []
    this.outputs = []
    this.loaded = false
    this.url = url
    this.clone = clone
  }

  downloadPlugin () {
    if (jetpack.exists(this.path)) {
      this.loadPlugin()
    } else {
      this.clone(`https://github.com/${this.url}`, this.path, { shallow: true }, (error) => {
        if (error) {
          notification.push({
            title: 'Plugin failed',
            message: `Plugin '${this.url}' failed to load.`,
          })
        } else {
          this.loadPlugin()
        }
      })
    }
  }

  loadPlugin () {
    this.plugin = require(path.join(this.path, 'zazu.js'))
    this.loaded = true

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
