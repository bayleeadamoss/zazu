const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const ServiceScript = require('../../../../app/blocks/external/serviceScript')
const { expect } = chai

chai.use(sinonChai)

let serviceScript
describe('ServiceScript', () => {
  beforeEach(() => {
    serviceScript = new ServiceScript({})
    serviceScript.script = (value) => {
      return new Promise((resolve, reject) => {
        resolve(value * 10)
      })
    }
  })
  describe('start', () => {
    it('calls handle after interval', (done) => {
      serviceScript.handle = sinon.stub().returns(Promise.resolve())
      serviceScript.start().then(() => {
        expect(serviceScript.handle).to.have.been.calledOnce
        done()
      })
    })
  })

  describe('handle', () => {
    it('executes correctly then calls start', (done) => {
      serviceScript.start = sinon.stub()
      serviceScript.handle().then(() => {
        expect(serviceScript.start).to.have.been.calledOnce
        done()
      })
    })
  })
})
