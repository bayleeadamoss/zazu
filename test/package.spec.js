import sinon from 'sinon'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import Package from '../app/package'
import mockFs from 'mock-fs'
import mockRequire from 'mock-require'
import path from 'path'

chai.use(sinonChai)

describe('Package', () => {
  const calculator = new Package('tinytacoteam/calculator', '/tmp')
  describe('download', () => {
    beforeEach(() => {
      calculator.clone = sinon.stub()
      mockRequire(path.join(calculator.path, 'zazu.js'), {
        blocks: {
          input: [],
          output: [],
        },
      })
    })

    afterEach(() => {
      mockFs.restore()
      mockRequire.stop()
    })

    describe('when the package exists', () => {
      beforeEach(() => {
        mockFs({
          '/tmp/tinytacoteam/calculator': {
            'zazu.js': '',
          },
        }, {createCwd: false, createTmp: false})
        calculator.download()
      })

      it('does not download', () => {
        expect(calculator.clone).to.not.be.called
      })
    })

    describe('when the package does not exist', () => {
      beforeEach(() => {
        mockFs({
          '/tmp': {},
        }, {createCwd: false, createTmp: false})
        calculator.download()
      })

      afterEach(() => {
        mockFs.restore()
      })

      it('downloads when its not found', () => {
        expect(calculator.clone).to.be.calledOnce
      })
    })
  })
})
