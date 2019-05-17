const configuration = require('./configuration')
const Datastore = require('nestdb')
const path = require('path')

const database = new Datastore({
  filename: path.join(configuration.databaseDir, 'installStatus.nedb'),
  autoload: true,
})

const set = (key, value) => {
  return new Promise((resolve, reject) => {
    database.update({ key }, { key, value }, { upsert: true }, (err) => {
      err ? reject(err) : resolve(value)
    })
  })
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    database.findOne({ key }).exec((err, doc) => {
      if (err) reject(err)
      resolve((doc || {}).value)
    })
  })
}

module.exports = {
  set,
  get,
}
