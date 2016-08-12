const { expect } = require('chai')
const configuration = require('../../app/lib/configuration')
const jetpack = require('fs-jetpack')
const os = require('os')
const path = require('path')

describe('Configuration', () => {
  beforeEach(() => {
    const base = path.join(os.tmpdir(), String(Math.random()))
    configuration.profilePath = path.join(base, '.zazurc.js')
    configuration.pluginDir = path.join(base, '.zazu/plugins/')
    jetpack.remove(configuration.profilePath)
    configuration.loaded = false
  })

  describe('load', () => {
    describe('given no configuration file', () => {
      beforeEach(() => {
        expect(jetpack.exists(configuration.profilePath)).to.be.false
        configuration.load()
      })

      it('creates zazurc file', () => {
        expect(jetpack.exists(configuration.profilePath)).to.be.okay
      })
    })

    describe('given a configuration file', () => {
      beforeEach(() => {
        jetpack.write(configuration.profilePath, 'module.exports = ' + JSON.stringify({
          hotkey: 'alt+space',
          theme: 'tinytacoteam/dark-purple',
          plugins: ['abc'],
        }))
        expect(jetpack.exists(configuration.profilePath)).to.be.okay
        configuration.load()
      })

      it('loads configuration file', () => {
        expect(configuration.plugins[0]).to.eq('abc')
        expect(configuration.hotkey).to.be.eq('alt+space')
        expect(configuration.theme).to.be.eq('tinytacoteam/dark-purple')
      })
    })
  })
})
