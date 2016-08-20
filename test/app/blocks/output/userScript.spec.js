const { expect } = require('chai')
const UserScript = require('../../../../app/blocks/output/userScript')

const userScript = new UserScript({})
userScript.script = (value) => {
  return new Promise((resolve, reject) => {
    resolve(value * 10)
  })
}

let state, subject
describe('UserScript', () => {
  beforeEach(() => {
    state = { value: 32, next: () => {} }
    subject = userScript.call(state)
  })
  it('can mutate the state', (done) => {
    subject.then(() => {
      expect(state.value).to.eq(320)
      done()
    })
  })
})
