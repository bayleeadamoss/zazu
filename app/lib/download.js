const git = require('./git')
const github = require('./github')

module.exports = git.isInstalled() ? git : github
