import cuid from 'cuid';

/**
 * Copies the input `value` to the top of the clipboard.
 *
 * ## Example
 *
 * ~~~
 * {
 *   id: 2,
 *   type: "CopyToClipboard"
 * }
 * ~~~
 */
export default class CopyToClipboard {
  constructor(data) {
    this.id = data && data.id || cuid();
    this.connections = [];
    this.clipboard = require('electron').clipboard;
  }

  call(state) {
    this.clipboard.writeText(String(state.value));
    state.next();
  }
}
