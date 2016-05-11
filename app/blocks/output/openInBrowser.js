import cuid from 'cuid'
import { shell } from 'electron'

import Template from '../../lib/template'

export default class OpenInBrowser {
  constructor (data) {
    this.id = data && data.id || cuid()
    this.url = data.url
  }

  call (state) {
    shell.openExternal(Template.compile(this.url, {
      value: String(state.value),
    }))
    state.next()
  }
}
