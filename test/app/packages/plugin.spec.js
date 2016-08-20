const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const Plugin = require('../../../app/packages/plugin')
const Block = require('../../../app/blocks/block')
const { expect } = chai

chai.use(sinonChai)

const blockFactory = (responds, connections) => {
  const block = new Block({
    type: 'noop',
    connections,
  })
  sinon.spy(block, 'call')
  return block
}

describe('Plugin', () => {
  const plugin = new Plugin('tinytacoteam/calculator')

  describe('respondsTo', () => {
    it('says false when no blocks provided', () => {
      plugin.inputs = []
      expect(plugin.respondsTo('hello')).to.not.be.okay
    })
    it('says false when no blocks respond to input', () => {
      plugin.inputs = [ blockFactory(false) ]
      expect(plugin.respondsTo('hello')).to.not.be.okay
    })
    it('says true when a block responds to input', () => {
      plugin.inputs = [ blockFactory(true) ]
      expect(plugin.respondsTo('hello')).to.be.okay
    })
    describe('when plugin is inactive', () => {
      beforeEach(() => {
        plugin.activeState = false
      })
      it('says true when a block responds to input', () => {
        plugin.inputs = [ blockFactory(true) ]
        expect(plugin.respondsTo('hello')).to.not.be.okay
      })
    })
  })

  describe('next', () => {
    beforeEach(() => {
      plugin.inputs = []
      plugin.outputs = []
      plugin.blocksById = {}
    })

    it('when an input has no links', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true))

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.not.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when an input has one link', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true, [
        plugin.outputs[0].id,
      ]))

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when and input has two links', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addInput(blockFactory(true, [
        plugin.outputs[0].id,
        plugin.outputs[1].id,
      ]))

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.have.been.calledOnce
    })
    it('works with deep output linking', () => {
      // Setup
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true))
      plugin.addOutput(blockFactory(true, [
        plugin.outputs[0].id,
      ]))
      plugin.addInput(blockFactory(true, [
        plugin.outputs[1].id,
        plugin.outputs[2].id,
      ]))

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.have.been.calledOnce
      expect(plugin.outputs[2].call).to.have.been.calledOnce
    })
  })
})
