import { expect } from 'chai'
import Zazu from '../app/zazu'

describe('Zazu', () => {
  it('responds to search', () => {
    expect(Zazu).to.respondTo('search')
  })
})
