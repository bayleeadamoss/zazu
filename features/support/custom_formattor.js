const { ProgressFormatter, Status } = require('cucumber')
const jetpack = require('fs-jetpack')
const path = require('path')

class SimpleFormatter extends ProgressFormatter {
  constructor (options) {
    super(options)
    options.eventBroadcaster.on('test-case-finished', this.printErrorLogs.bind(this))
  }

  printErrorLogs ({ sourceLocation, result }) {
    if (result.status === Status.FAILED) {
      const { gherkinDocument, pickle } = this.eventDataCollector.getTestCaseData(sourceLocation)
      this.log(`\n\n${gherkinDocument.feature.name} / ${pickle.name}\n`)
      const homeDir = path.join(__dirname, '../../test/fixtures/home')
      const logDir = path.join(homeDir, '.zazu/log')
      const files = jetpack.list(logDir) || []
      files.map(file => {
        const logFile = path.join(logDir, file)
        console.log(`\n---logs---\n${file}\n`)
        jetpack
          .read(logFile)
          .split('\n')
          .map(logLine => {
            try {
              return JSON.stringify(JSON.parse(logLine), null, '  ')
            } catch {
              return logLine
            }
          })
          .forEach(line => console.log(line))
      })
      console.log('\n')
    }
  }
}

module.exports = SimpleFormatter
