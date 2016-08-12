const resultSorter = {
  sort (results, clickedResults) {
    return results.map((result) => {
      let score = -1
      if (result.id) {
        score = clickedResults.reduce((memo, clickedResult) => {
          if (clickedResult.id === result.id) memo++
          return memo
        }, 0)
      }
      return { score, result }
    }).sort((a, b) => {
      if (a.score < b.score) return 1
      if (a.score > b.score) return -1
      return 0
    }).map((item) => {
      return item.result
    })
  },
}

module.exports = resultSorter
