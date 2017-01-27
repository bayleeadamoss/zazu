const { expect } = require('chai')
const resultSorter = require('../../../app/transforms/resultSorter')

describe('ResultSorter', () => {
  describe('given the second item is clicked', () => {
    it('ranks the second item first', () => {
      const results = [
        { id: 'burrito', blockRank: 1 },
        { id: 'taco', blockRank: 1 },
        { id: 'quesadilla', blockRank: 1 },
      ]
      const clicked = [ { id: 'taco' } ]
      const sortedNames = resultSorter.sort(results, clicked)
      expect(sortedNames).to.deep.equal([
        { id: 'taco', blockRank: 1 },
        { id: 'burrito', blockRank: 1 },
        { id: 'quesadilla', blockRank: 1 },
      ])
    })
  })

  describe('given some results without ids', () => {
    it('ranks the second item first', () => {
      const results = [
        { id: 'burrito', blockRank: 1 },
        { id: 'taco', blockRank: 1 },
        { id: 'quesadilla', blockRank: 1 },
      ]
      const sortedNames = resultSorter.sort(results, [])
      expect(sortedNames).to.deep.equal([
        { id: 'burrito', blockRank: 1 },
        { id: 'taco', blockRank: 1 },
        { id: 'quesadilla', blockRank: 1 },
      ])
    })
  })

  describe('given mixed results', () => {
    it('ranks the second item first', () => {
      const results = [
        { name: 'cheeseburger', blockRank: 1 },
        { id: 1, name: 'burrito', blockRank: 1 },
        { id: 2, name: 'taco', blockRank: 1 },
        { id: 3, name: 'quesadilla', blockRank: 1 },
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
        { title: 'One', blockRank: 1 },
        { title: 'Two', blockRank: 1 },
        { title: 'Three', blockRank: 1 },
        { title: 'Four', blockRank: 1 },
        { title: 'Five', blockRank: 1 },
        { title: 'Six', blockRank: 1 },
        { title: 'Seven', blockRank: 1 },
        { title: 'Eight', blockRank: 1 },
        { title: 'Nine', blockRank: 1 },
        { title: 'Ten', blockRank: 1 },
        { title: 'Eleven', blockRank: 1 },
        { title: 'Twelve', blockRank: 1 },
        { title: 'Thirteen', blockRank: 1 },
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

  describe('given various block return types', () => {
    it('ranks higher block types first', () => {
      const results = [
        { id: 'burrito', blockRank: 0 },
        { id: 'taco', blockRank: 1 },
        { id: 'quesadilla', blockRank: 0 },
      ]
      const sortedNames = resultSorter.sort(results, [])
      expect(sortedNames).to.deep.equal([
        { id: 'taco', blockRank: 1 },
        { id: 'burrito', blockRank: 0 },
        { id: 'quesadilla', blockRank: 0 },
      ])
    })

    it('sorts clicked items higher', () => {
      const results = [
        { id: 'burrito', blockRank: 0 },
        { id: 'taco', blockRank: 1 },
        { id: 'quesadilla', blockRank: 0 },
      ]
      const clicked = [ { id: 'quesadilla' }, { id: 'quesadilla' } ]
      const sortedNames = resultSorter.sort(results, clicked)
      expect(sortedNames).to.deep.equal([
        { id: 'quesadilla', blockRank: 0 },
        { id: 'taco', blockRank: 1 },
        { id: 'burrito', blockRank: 0 },
      ])
    })
  })
})
