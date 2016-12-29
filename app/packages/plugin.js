const path = require('path')
const jetpack = require('fs-jetpack')

const Input = require('../blocks/input')
const Output = require('../blocks/output')
const External = require('../blocks/external')

const npmInstall = require('../lib/npmInstall')
const notification = require('../lib/notification')
const track = require('../lib/track')
const pluginFreshRequire = require('../lib/pluginFreshRequire')

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
  }

  setActive (activeState) {
    this.activeState = activeState
    if (this.activeState) this.logger.log('info', 'activate plugin')
    this.inputs.forEach((input) => {
      input.setScoped(null)
    })
  }

  setScoped (activeState, blockId) {
    this.activeState = activeState
    if (this.activeState) this.logger.log('info', 'scoping plugin')
    this.inputs.forEach((input) => {
      input.setScoped(input.id === blockId)
    })
  }

  update () {
    return super.update().then(() => {
      this.logger.log('info', 'npm install')
      return npmInstall(this.path)
    }).then(() => {
      return pluginFreshRequire(this.path)
    }).catch((error) => {
      notification.push({
        title: this.id + ' failed to update',
        message: error.message,
      })
    })
  }

  download () {
    return super.download().then((action) => {
      if (action === 'downloaded') {
        this.logger.log('verbose', 'npm install')
        return npmInstall(this.path)
      } else {
        return Promise.resolve()
      }
    }).catch((error) => {
      notification.push({
        title: this.id + ' failed to download',
        message: error.message,
      })
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
        if (External[external.type]) {
          this.addExternal(new External[external.type](external, this.options))
        } else {
          throw new Error(`Type "${external.type}" is not a recognized external block.`)
        }
      })

      plugin.blocks.input.forEach((input) => {
        input.cwd = this.path
        input.pluginId = this.id
        if (Input[input.type]) {
          this.addInput(new Input[input.type](input))
        } else {
          throw new Error(`Type "${input.type}" is not a recognized input block.`)
        }
      })

      plugin.blocks.output.forEach((output) => {
        output.cwd = this.path
        output.pluginId = this.id
        if (Output[output.type]) {
          this.addOutput(new Output[output.type](output))
        } else {
          throw new Error(`Type "${output.type}" is not a recognized output block.`)
        }
      })
    }).catch((e) => {
      this.logger.log('error', this.id + ' failed to install', {
        message: e.message,
        stack: e.stack,
      })
      notification.push({
        title: this.id + ' failed to install',
        message: e.message,
      })
    })
  }

  addExternal (external) {
    external.start()
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
    const promises = previousBlock.connections.map((blockId) => {
      const nextBlock = this.blocksById[blockId]
      const nextState = Object.assign({}, state, { blockId })
      const tracer = track.tracer(this.id + '/' + nextBlock.id)
      nextState.next = this.next.bind(this, nextState)
      return nextBlock.call(nextState, this.options)
        .then(tracer.complete)
        .catch(tracer.error)
    })
    return Promise.all(promises)
  }

  search (inputText) {
    return this.inputs.reduce((responsePromises, input) => {
      if (input.isActive() && input.respondsTo(inputText)) {
        const tracer = track.tracer(this.id + '/' + input.id)
        responsePromises.push(
          input.search(inputText, this.options)
            .then((results = []) => {
              return results.map((result) => {
                const icon = result.icon || this.plugin.icon || 'fa-bolt'
                const isFontAwesome = icon.indexOf('fa-') === 0 && icon.indexOf('.') === -1
                result.icon = isFontAwesome ? icon : path.join(this.path, icon)
                result.previewCss = this.plugin.css
                result.pluginName = this.url
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
