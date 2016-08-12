const { expect } = require('chai')
const PrefixScript = require('../../../app/blocks/input/prefixScript')

var prefixScript = new PrefixScript({
  prefix: 'test',
  space: true,
  args: 'Required',
})
prefixScript.script = (query) => {
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

describe('PrefixScript', () => {
  describe('query', () => {
    describe('when spaces are required', () => {
      beforeEach(() => {
        prefixScript.space = true
      })

      it('returns data when space is passed', () => {
        expect(prefixScript.query('test data')).is.equal('data')
      })
    })
    describe('when spaces arent required', () => {
      beforeEach(() => {
        prefixScript.space = false
      })

      it('returns data when no space is passed', () => {
        expect(prefixScript.query('testdata')).is.equal('data')
      })
    })
  })
  describe('respondsTo', () => {
    describe('when arguments and spaces are required', () => {
      beforeEach(() => {
        prefixScript.space = true
        prefixScript.args = 'Required'
      })

      it('fails when input has no arguments', () => {
        expect(prefixScript.respondsTo('test')).to.not.be.ok
      })

      it('fails when input has no space', () => {
        expect(prefixScript.respondsTo('testdata')).to.not.be.ok
      })

      it('passes with space and argument', () => {
        expect(prefixScript.respondsTo('test data')).to.be.ok
      })
    })
    describe('when arguments are optional and spaces are required', () => {
      beforeEach(() => {
        prefixScript.space = true
        prefixScript.args = 'Optional'
      })

      it('passes when input has a space and an argument', () => {
        expect(prefixScript.respondsTo('test data')).to.be.ok
      })

      it('fails when input has no space and an argument', () => {
        expect(prefixScript.respondsTo('testdata')).to.not.be.ok
      })

      it('passes when input has space and no argument', () => {
        expect(prefixScript.respondsTo('test ')).to.be.ok
      })

      it('passes when input has space and no argument', () => {
        expect(prefixScript.respondsTo('test')).to.not.be.ok
      })
    })
    describe('when no spaces or arguments are required', () => {
      beforeEach(() => {
        prefixScript.space = false
        prefixScript.args = 'None'
      })

      it('passes when input has no space', () => {
        expect(prefixScript.respondsTo('test')).to.be.ok
      })

      it('fails when input has an argument', () => {
        expect(prefixScript.respondsTo('testdata')).to.not.be.ok
      })

      it('fails with space and argument', () => {
        expect(prefixScript.respondsTo('test data')).to.not.be.ok
      })
    })
    describe('when scoped', () => {
      beforeEach(() => {
        prefixScript.isScoped = true
        prefixScript.args = 'Optional'
        prefixScript.space = true
      })

      it('passes', () => {
        expect(prefixScript.respondsTo('literally anything')).to.be.ok
      })

      it('passes with no input', () => {
        expect(prefixScript.respondsTo('')).to.be.ok
      })
    })
  })
})
