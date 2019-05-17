const path = require('path')
const jetpack = require('fs-jetpack')

const Input = require('../blocks/input')
const Output = require('../blocks/output')
const External = require('../blocks/external')

const npmInstall = require('../lib/npmInstall')
const notification = require('../lib/notification')
const track = require('../lib/track')
const globalEmitter = require('../lib/globalEmitter')

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
    this.plugin = {}
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
      this.logger.log('info', 'npm install for update')
      return npmInstall(this.url, this.path)
    }).then(() => {
      globalEmitter.emit('pluginFreshRequire', this.path)
    }).catch((error) => {
      this.logger.error('failed to install plugin', error)
      notification.push({
        title: this.id + ' failed to update',
        message: error.message,
      })
    })
  }

  download () {
    return super.download().then((action) => {
      if (action === 'cloned') {
        this.logger.log('verbose', 'npm install for download')
        return npmInstall(this.url, this.path)
      } else {
        return Promise.resolve()
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
      this.logger.error(this.id + ' failed to load', e)
      notification.push({
        title: this.id + ' failed to load',
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

  transformResults (blockId, results = []) {
    return results.map((result) => {
      const icon = result.icon || this.plugin.icon || 'fa-bolt'
      const isFontAwesome = (icon.indexOf('fa-') === 0 && icon.indexOf('.') === -1)
      const isAbsolutePath = (icon.indexOf('/') === 0 || icon.indexOf(this.path) === 0)
      const isResource = icon.startsWith('http') || icon.startsWith('data:image')
      const shouldAddPath = !isFontAwesome && !isAbsolutePath && !isResource
      const finalResult = Object.assign({}, result, {
        icon: shouldAddPath ? path.join(this.path, icon) : icon,
        previewCss: this.plugin.css,
        pluginName: this.url,
        blockId,
      })
      finalResult.next = this.next.bind(this, finalResult)
      return finalResult
    })
  }

  /**
   * {
   *  someInput: <Promise />,
   *  someOtherInput: <Promise />,
   * }
   */
  search (inputText) {
    if (!this.loaded || !this.activeState) { return {} }
    return this.inputs.reduce((promiseList, input) => {
      if (!input.isActive() || !input.respondsTo(inputText, this.options)) {
        return promiseList
      }
      const blockId = input.id
      const tracer = track.tracer(this.id + '/' + blockId)
      const inputPromise = input.search(inputText, this.options)
        .then((results) => {
          return this.transformResults(blockId, results)
        })
        .then(tracer.complete)
        .catch(tracer.error)
      promiseList[blockId] = inputPromise
      return promiseList
    }, {})
  }
}

module.exports = Plugin
