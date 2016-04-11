import sinon from 'sinon'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import Plugin from '../app/plugin'

chai.use(sinonChai)

let id = 0
const blockFactory = (responds, connections) => {
  return {
    id: ++id,
    respondsTo: sinon.stub().returns(responds),
    call: sinon.stub(),
    connections: connections || [],
  }
}

describe('Plugin', () => {
  const plugin = new Plugin('tinytacoteam/calculator', '/tmp')

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
  })

  describe('next', () => {
    it('when an input has no links', () => {
      // Setup
      plugin.outputs = [ blockFactory(true), blockFactory(true) ]
      plugin.inputs = [ blockFactory(true) ]

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.not.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when an input has one link', () => {
      // Setup
      plugin.outputs = [ blockFactory(true), blockFactory(true) ]
      plugin.inputs = [
        blockFactory(true, [
          plugin.outputs[0].id,
        ]),
      ]

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.not.have.been.calledOnce
    })
    it('when and input has two links', () => {
      // Setup
      plugin.outputs = [ blockFactory(true), blockFactory(true) ]
      plugin.inputs = [
        blockFactory(true, [
          plugin.outputs[0].id,
          plugin.outputs[1].id,
        ]),
      ]

      // Execution
      let state = {blockId: plugin.inputs[0].id}
      plugin.next(state)

      // Assertion
      expect(plugin.outputs[0].call).to.have.been.calledOnce
      expect(plugin.outputs[1].call).to.have.been.calledOnce
    })
  })
})
