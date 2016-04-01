import jQuery from 'jQuery'

import Zazu from './zazu'
import View from './view'

const zazu = new Zazu()

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
