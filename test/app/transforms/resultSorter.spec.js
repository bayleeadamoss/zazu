const { expect } = require('chai')
const resultSorter = require('../../../app/transforms/resultSorter')

describe('ResultSorter', () => {
  describe('given the second item is clicked', () => {
    it('ranks the second item first', () => {
      const results = [
        { id: 'burrito' },
        { id: 'taco' },
        { id: 'quesadilla' },
      ]
      const clicked = [ { id: 'taco' } ]
      const sortedNames = resultSorter.sort(results, clicked)
      expect(sortedNames).to.deep.equal([
        { id: 'taco' },
        { id: 'burrito' },
        { id: 'quesadilla' },
      ])
    })
  })

  describe('given some results without ids', () => {
    it('ranks the second item first', () => {
      const results = [
        { id: 'burrito' },
        { id: 'taco' },
        { id: 'quesadilla' },
      ]
      const sortedNames = resultSorter.sort(results, [])
      expect(sortedNames).to.deep.equal([
        { id: 'burrito' },
        { id: 'taco' },
        { id: 'quesadilla' },
      ])
    })
  })

  describe('given mixed results', () => {
    it('ranks the second item first', () => {
      const results = [
        { name: 'cheeseburger' },
        { id: 1, name: 'burrito' },
        { id: 2, name: 'taco' },
        { id: 3, name: 'quesadilla' },
      ]
      const clicked = [ { id: 2 } ]
      const sortedNames = resultSorter.sort(results, clicked).map((item) => {
        return item.name
      })
      expect(sortedNames).to.deep.equal([
        'taco',
        'burrito',
        'quesadilla',
        'cheeseburger',
      ])
    })
  })
})
