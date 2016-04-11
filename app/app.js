import jQuery from 'jQuery'

import Zazu from './zazu'
import View from './view'
import insertCss from 'insert-css'

const zazu = new Zazu()

zazu.loadTheme().then((plugin) => {
  insertCss(plugin.css)
})

// Eh?
const input = jQuery('#query')
const resultsView = new View(jQuery('#results'))

input.focus().on('keyup', () => {
  zazu.search(input.val(), (promises) => {
    resultsView.clear()
    promises.forEach((promise) => {
      promise.then((results) => {
        resultsView.add(results)
      })
    })
  })
})
