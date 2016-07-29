const Datastore = require('nedb')
const path = require('path')
const track = require('../vendor/nr')

const databasePath = path.join(require('os').homedir(), '.zazu/databases/track.nedb')
const database = new Datastore({
  filename: databasePath,
  autoload: true,
})

let clickedResults = []
database.find({}).exec((err, docs) => {
  if (!err) {
    clickedResults = docs
  }
})

class ResultSorter {
  constructor (results) {
    this.results = results
  }

  sort () {
    return this.results.map((result) => {
      if (result.id) {
        result.score = clickedResults.reduce((memo, clickedResult) => {
          if (clickedResult.id === result.id) memo++
          return memo
        }, 0)
      } else {
        result.score = 0
      }
      return result
    }).sort((a, b) => {
      if (a.score < b.score) return 1
      if (a.score > b.score) return -1
      return 0
    })
  }

  static trackClick (doc) {
    const clickedResult = Object.assign({}, {
      createdAt: new Date(),
    }, doc)
    track.addPageAction('clickedResult', {
      pluginName: doc.pluginName,
    })
    clickedResults.push(clickedResult)
    return new Promise((resolve, reject) => {
      database.insert(clickedResult, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }
}

module.exports = ResultSorter
