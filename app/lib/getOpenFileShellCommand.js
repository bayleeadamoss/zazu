const os = require('os')

module.exports = function getOpenFileShellCommand () {
  switch (os.type()) {
    case 'Darwin':
      return 'open'
    case 'Windows_NT':
      return 'start'
    default:
      return 'xdg-open'
  }
}
