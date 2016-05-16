import { expect } from 'chai'
import PrefixScript from '../../../app/blocks/input/prefixScript'

var prefixScript = new PrefixScript({
  id: 1,
  prefix: 'test',
  space: true,
  args: 'Required',
  script: '',
  connections: [],
})

describe('PrefixScript', () => {
  describe('query', () => {
    describe('when spaces are allowed', () => {
      beforeEach(() => {
        prefixScript.space = true
      })

      it('returns data when space is passed', () => {
        expect(prefixScript.query('test data')).is.equal('data')
      })
    })
    describe('when spaces arent allowed', () => {
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
        expect(prefixScript.respondsTo('test')).isNotOkay
      })

      it('fails when input has no space', () => {
        expect(prefixScript.respondsTo('testdata')).isNotOkay
      })

      it('passes with space and argument', () => {
        expect(prefixScript.respondsTo('test data')).isOkay
      })
    })
    describe('when arguments are optional and spaces are required', () => {
      beforeEach(() => {
        prefixScript.space = true
        prefixScript.args = 'Optional'
      })

      it('passes when input has a space and an argument', () => {
        expect(prefixScript.respondsTo('test data')).isOkay
      })

      it('fails when input has no space and an argument', () => {
        expect(prefixScript.respondsTo('testdata')).isNotOkay
      })

      it('passes when input has space and no argument', () => {
        expect(prefixScript.respondsTo('test ')).isOkay
      })

      it('passes when input has space and no argument', () => {
        expect(prefixScript.respondsTo('test')).isNotOkay
      })
    })
    describe('when no spaces or arguments are required', () => {
      beforeEach(() => {
        prefixScript.space = false
        prefixScript.args = 'None'
      })

      it('passes when input has no space', () => {
        expect(prefixScript.respondsTo('test')).isOkay
      })

      it('fails when input has an argument', () => {
        expect(prefixScript.respondsTo('testdata')).isNotOkay
      })

      it('fails with space and argument', () => {
        expect(prefixScript.respondsTo('test data')).isNotOkay
      })
    })
  })
})
