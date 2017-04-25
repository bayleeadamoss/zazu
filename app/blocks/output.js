const CopyToClipboard = require('./output/copyToClipboard')
const OpenInBrowser = require('./output/openInBrowser')
const SendNotification = require('./output/sendNotification')
const UserScript = require('./output/userScript')
const ShowFile = require('./output/showFile')
const OpenFile = require('./output/openFile')
const ReloadConfig = require('./output/reloadConfig')
const Preview = require('./output/preview')
const PlaySound = require('./output/playSound')

module.exports = {
  CopyToClipboard,
  OpenInBrowser,
  SendNotification,
  UserScript,
  OpenFile,
  ShowFile,
  ReloadConfig,
  Preview,
  PlaySound,
}
