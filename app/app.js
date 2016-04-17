import jQuery from 'jQuery'
import { remote } from 'electron'

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

remote.getCurrentWindow().on('show', () => {
  input.focus()
})

input.on('keyup', () => {
  zazu.search(input.val(), (promises) => {
    resultsView.clear()
    promises.forEach((promise) => {
      promise.then((results) => {
        resultsView.add(results)
      })
    })
  })
})
