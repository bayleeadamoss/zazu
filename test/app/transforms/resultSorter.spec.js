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

  describe('given non-deterministic sorts', () => {
    it('maintains the current index', () => {
      const results = [
        { title: 'One' },
        { title: 'Two' },
        { title: 'Three' },
        { title: 'Four' },
        { title: 'Five' },
        { title: 'Six' },
        { title: 'Seven' },
        { title: 'Eight' },
        { title: 'Nine' },
        { title: 'Ten' },
        { title: 'Eleven' },
        { title: 'Twelve' },
        { title: 'Thirteen' },
      ]
      const sortedItems = resultSorter.sort(results, []).map((item) => {
        return item.title
      })
      expect(sortedItems).to.deep.equal([
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
      ])
    })
  })
})
