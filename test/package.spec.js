const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const Package = require('../app/package')
const path = require('path')
const os = require('os')
const jetpack = require('fs-jetpack')

const { expect } = chai

chai.use(sinonChai)

describe('Package', () => {
  const base = path.join(os.tmpdir(), String(Math.random()))
  const calculator = new Package('example/calculator', base)
  describe('download', () => {
    beforeEach(() => {
      calculator.clone = sinon.stub()
      jetpack.remove(calculator.path)
    })

    describe('when the package exists', () => {
      beforeEach(() => {
        jetpack.write(calculator.path, 'test')
        expect(jetpack.exists(calculator.path)).to.be.truthy
        calculator.download()
      })

      it('does not download', () => {
        expect(calculator.clone).to.not.be.called
      })
    })

    describe('when the package does not exist', () => {
      beforeEach(() => {
        expect(jetpack.exists(calculator.path)).to.be.false
        calculator.download()
      })

      it('downloads when its not found', () => {
        expect(calculator.clone).to.be.calledOnce
      })
    })
  })
})
