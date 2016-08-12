module.exports = function () {
  this.After(function (scenario) {
    return this.close()
  })
}
