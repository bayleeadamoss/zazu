const { expect } = require('chai')
const Template = require('../../app/lib/template')

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

    it('replaces with empty strings', () => {
      expect(Template.compile('{first}:{last}', {
        first: 'tiny',
        last: '',
      })).to.eq('tiny:')
    })

    it('doesnt replace empty brackets', () => {
      expect(Template.compile('{}:{first}', {
        first: 'tiny',
      })).to.eq('{}:tiny')
    })
  })
})
