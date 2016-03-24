import sinon from 'sinon'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import CopyToClipboard from '../../../app/plugin/output/copyToClipboard'

chai.use(sinonChai)

describe('CopyToClipboard', () => {
  const clipboard = {
    writeText: sinon.stub(),
  }
  const copyToClipboard = new CopyToClipboard()
  copyToClipboard.clipboard = clipboard

  describe('call', () => {
    let state

    beforeEach(() => {
      state = {
        value: 'FooBaz',
        next: sinon.stub(),
      }
      copyToClipboard.call(state)
    })

    it('should call next on state', () => {
      expect(state.next).to.have.been.calledOnce
    })

    it('should writeText', () => {
      expect(clipboard.writeText).to.have.been.calledWith(state.value)
    })
  })
})
