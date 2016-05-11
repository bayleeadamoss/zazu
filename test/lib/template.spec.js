import { expect } from 'chai'
import Template from '../../app/lib/template'

describe('Template', () => {
  describe('compile', () => {
    it('replaces variables with their value', () => {
      expect(Template.compile('{first}{last}', {
        first: 'tiny',
        last: 'taco',
      })).to.eq('tinytaco')
    })

    it('replaces the same variable multiple times', () => {
      expect(Template.compile('{first}{first}', {
        first: 'tiny',
        last: 'taco',
      })).to.eq('tinytiny')
    })
  })
})
