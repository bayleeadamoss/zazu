const { expect } = require('chai')
const { cooldown, warmup } = require('../../../app/lib/manager')

describe('Manager', () => {
  describe('cooldown', () => {
    it('replaces variables with their value', (done) => {
      let totalCooldowns = 0
      const coolFn = cooldown(() => {
        return new Promise((resolve) => setTimeout(resolve, 100))
      }, () => {
        totalCooldowns++
      })
      for (let i = 0; i < 5; i++) coolFn()
      expect(totalCooldowns).to.eq(0)
      setTimeout(() => {
        expect(totalCooldowns).to.eq(1)
        done()
      }, 150)
    })
  })

  describe('warmup', () => {
    it('replaces variables with their value', (done) => {
      let totalWarmups = 0
      const warmFn = warmup(() => {
        return new Promise((resolve) => setTimeout(resolve, 100))
      }, () => {
        totalWarmups++
      })
      for (let i = 0; i < 5; i++) warmFn()
      expect(totalWarmups).to.eq(1)
      setTimeout(() => {
        expect(totalWarmups).to.eq(1)
        done()
      }, 150)
    })
  })
})
