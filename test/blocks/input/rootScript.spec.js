const { expect } = require('chai')
const RootScript = require('../../../app/blocks/input/rootScript')

const rootScript = new RootScript({})
rootScript.script = {
  search: (input, env) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1100)
    })
  },
  respondsTo: () => {
    return true
  },
}

let subjectStart, subject
describe('RootScript', () => {
  beforeEach(() => {
    subjectStart = new Date()
    subject = rootScript.search(2)
  })
  it('takes at least 1000ms to complete', (done) => {
    subject.then(() => {
      expect(new Date() - subjectStart).to.be.gt(1000)
      done()
    })
  })
})
