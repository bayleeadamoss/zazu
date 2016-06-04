const { expect } = require('chai')
const Process = require('../../app/lib/process')

let subject, subjectStart
describe('Process', () => {
  describe('execute', () => {
    beforeEach(() => {
      subjectStart = new Date()
      subject = Process.execute('node -e "setTimeout(() => {}, 1100)"')
    })

    it('takes at least 1000ms to complete', (done) => {
      subject.finally(() => {
        expect(new Date() - subjectStart).to.be.gt(1000)
        done()
      })
    })

    describe('when canceling promise', () => {
      it('takes less than 500ms to cancel', (done) => {
        subject.finally(() => {
          expect(new Date() - subjectStart).to.be.lt(500)
          done()
        })
        subject.cancel()
      })
    })
  })
})
