import sinon from 'sinon'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import Package from '../app/package'
import path from 'path'
import os from 'os'
import jetpack from 'fs-jetpack'

chai.use(sinonChai)

describe('Package', () => {
  const base = path.join(os.tmpdir(), String(Math.random()))
  const calculator = new Package('tinytacoteam/calculator', base)
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
