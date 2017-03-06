const { expect } = require('chai')
const mergeUnique = require('../../../app/lib/mergeUnique')

describe('mergeUnique', () => {
  it('adds to the end', () => {
    const expected = ['tiny', 'taco', 'team']
    expect(mergeUnique('tiny', ['taco', 'team'])).to.deep.equal(expected)
  })

  it('does not add the same item twice', () => {
    const expected = ['tiny', 'taco', 'team']
    expect(mergeUnique('tiny', ['tiny', 'taco', 'team'])).to.deep.equal(expected)
  })

  it('moves items to the beginning', () => {
    const expected = ['taco', 'tiny', 'team']
    expect(mergeUnique('taco', ['tiny', 'taco', 'team'])).to.deep.equal(expected)
  })
})
