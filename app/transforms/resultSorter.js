const resultSorter = {
  sort (results, clickedResults) {
    return results.slice(0).map((result) => {
      let score = -1
      if (result.id) {
        score = clickedResults.reduce((memo, clickedResult) => {
          if (clickedResult.id === result.id) memo++
          return memo
        }, 0)
      }
      return { score, result }
    }).sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      const aIndex = results.indexOf(a.result)
      const bIndex = results.indexOf(b.result)
      return aIndex - bIndex
    }).map((item) => {
      return item.result
    })
  },
}

module.exports = resultSorter
