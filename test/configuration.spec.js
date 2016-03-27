import { expect } from 'chai'
import configuration from '../app/configuration'
import mockFs from 'mock-fs'
import jetpack from 'fs-jetpack'
import mockRequire from 'mock-require'

describe('Configuration', () => {
  beforeEach(() => {
    mockRequire(configuration.profilePath, {
      hotkey: 'alt+space',
      theme: 'tinytacoteam/dark-purple',
      plugins: ['abc'],
    })
  })

  afterEach(() => {
    mockFs.restore()
    mockRequire.stop()
  })

  describe('loadFile', () => {
    describe('given no configuration file', () => {
      beforeEach(() => {
        mockFs({
          'templates': {
            'zazurc.js': '',
          },
        })
        expect(jetpack.exists(configuration.profilePath)).to.be.false
        configuration.loadFile()
      })

      it('creates zazurc file', () => {
        expect(jetpack.exists(configuration.profilePath)).to.be.okay
      })
    })

    describe('given a configuration file', () => {
      beforeEach(() => {
        const fs = {}
        fs[require('os').homedir()] = {
          '.zazurc.js': '',
        }
        mockFs(fs, {createCwd: false, createTmp: false})
        expect(jetpack.exists(configuration.profilePath)).to.be.okay
        configuration.loadFile()
      })

      it('loads configuration file', () => {
        expect(configuration.plugins[0]).to.eq('abc')
        expect(configuration.hotkey).to.be.eq('alt+space')
        expect(configuration.theme).to.be.eq('tinytacoteam/dark-purple')
      })
    })
  })
})
