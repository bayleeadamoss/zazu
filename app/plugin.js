const path = require('path')
const jetpack = require('fs-jetpack')
const npmInstall = require('./lib/npmInstall')

const Input = require('./blocks/input')
const Output = require('./blocks/output')
const External = require('./blocks/external')
const notification = require('./lib/notification')
const globalEmitter = require('./lib/globalEmitter')
const track = require('./vendor/nr')
const Package = require('./package')

class Plugin extends Package {
  constructor (url, options = {}) {
    super(url)
    this.id = url
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

  download () {
    return super.download().then((action) => {
      if (action === 'downloaded') {
        return new Promise((resolve, reject) => {
          npmInstall(this.path).then(resolve)
        })
      }
    })
  }

  load () {
    return super.load().then((plugin) => {
      this.loaded = true
      this.plugin = plugin

      if (plugin.stylesheet) {
        plugin.css = jetpack.read(path.join(this.path, plugin.stylesheet))
      }

      plugin.blocks.external.forEach((external) => {
        external.cwd = this.path
        external.pluginId = this.id
        this.addExternal(new External[external.type](external, this.options))
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
    this.blocksById[external.id] = external
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
    return this.inputs.reduce((responsePromises, input) => {
      if (input.respondsTo(inputText)) {
        const tracer = track.tracer(this.id + '/' + input.id)
        responsePromises.push(
          input.search(inputText, this.options)
            .then((results = []) => {
              return results.map((result) => {
                result.previewCss = this.plugin.css
                result.pluginName = this.url
                result.icon = result.icon || path.join(this.path, this.plugin.icon)
                result.blockId = input.id
                result.next = this.next.bind(this, result)
                return result
              })
            })
            .then(tracer.complete)
            .catch(tracer.error)
        )
      }
      return responsePromises
    }, [])
  }
}

module.exports = Plugin
