const electron = require('electron')
const https = require('https')
const http = require('http')
const app = electron.app || electron.remote.app

module.exports = (opts) => {
  const options = Object.assign({}, opts, {
    headers: {
      'User-Agent': `ZazuApp v${app.getVersion()}`,
    },
  })
  return new Promise((resolve, reject) => {
    const lib = opts.https ? https : http
    lib.get(options, (res) => {
      var chunks = []
      res.on('data', (chunk) => {
        chunks.push(chunk.toString())
      })
      res.on('end', () => {
        resolve(JSON.parse(chunks.join('')))
      })
      res.on('error', (e) => {
        reject(e)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
}
