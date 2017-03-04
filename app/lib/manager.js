const manager = (fn, warmupFn, cooldownFn) => {
  let count = 0
  const decrement = () => --count === 0 && cooldownFn()
  const increment = () => count++ === 0 && warmupFn()
  return function () {
    increment()
    return fn(...arguments).then(() => {
      decrement()
    }).catch((e) => {
      decrement()
      throw e
    })
  }
}

/**
 * Will execute `cb()` before all calls to `fn()` happen.
 *
 * ~~~ javascript
 * const cooldownExampleFn = cooldown(() => {
 *   return new Promise((resolve, reject) => {
 *     const timeout = Math.floor(Math.random() * 1000) + 5000
 *     setTimeout(resolve, timeout)
 *   })
 * }, () => {
 *   console.log('cooling down...')
 * })
 * ~~~
 */
const cooldown = (fn, cb) => {
  return manager(fn, () => {}, cb)
}

/**
 * Will execute `cb()` when all promises from `fn` have been resolved.
 *
 * ~~~ javascript
 * const cooldownExampleFn = cooldown(() => {
 *   return new Promise((resolve, reject) => {
 *     const timeout = Math.floor(Math.random() * 1000) + 5000
 *     setTimeout(resolve, range(1000, timeout))
 *   })
 * }, () => {
 *   console.log('cooling down...')
 * })
 * ~~~
 */
const warmup = (fn, cb) => {
  return manager(fn, cb, () => {})
}

module.exports = {
  warmup,
  cooldown,
}
