const { expect } = require('chai')
const RootScript = require('../../../app/blocks/input/rootScript')

const rootScript = new RootScript({
  id: 1,
  script: 'node -e "setTimeout(() => {console.log(\'{}\')}, 1100)"',
  connections: [],
})

let subjectStart, subject
describe('RootScript', () => {
  beforeEach(() => {
    subjectStart = new Date()
    subject = rootScript.search(2)
  })
  it('takes at least 1000ms to complete', (done) => {
    subject.finally(() => {
      expect(new Date() - subjectStart).to.be.gt(1000)
      done()
    })
  })
  describe('when rerunning the search', () => {
    beforeEach(() => {
      const script = rootScript.search(1)
      script.cancel()
    })
    it('takes less than 500ms to cancel', (done) => {
      subject.finally(() => {
        expect(new Date() - subjectStart).to.be.lt(500)
        done()
      })
    })
  })
})
