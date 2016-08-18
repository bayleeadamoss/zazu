module.exports = {
  isRenderer: process.type === 'renderer',
  isMain: process.type !== 'renderer',
  name: process.env.NODE_ENV || 'production',
}
