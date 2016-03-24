import jQuery from 'jQuery'

export default class View {
  constructor (output) {
    this.output = output
  }

  clear () {
    this.output.empty()
  }

  add (results) {
    results.forEach((result) => {
      this.output.append(
        jQuery('<li>' + result.value + '</li>')
          .data('result', result)
          .on('click', this.click.bind(this))
      )
    })
  }

  click (event) {
    const result = jQuery(event.target).data('result')
    this.clear()
    result.next()
  }
}
