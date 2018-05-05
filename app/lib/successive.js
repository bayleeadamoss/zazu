// Console.log alias
const l   = (...args)   => console.log(...args)

// Reject promise with custom error alias
const err = (rej, type) => rej(new Error(type))

// SetTimeout alias
const STO = (fn, ms) => setTimeout(fn, ms)

// new Promise alias
const mkProm = function(func, ...args) { return new Promise(func.bind(this, ...args)) }

class Successive {
  // track timeout ref
  constructor () { Object.assign(this, {}, { to: null }) }
  deflect (fn, ms) {
    // Create a promise
    return mkProm((res, rej) => {
      // Track local ref for timeout
      const to = this.to = STO(
        // Compare local ref 
        _ => to === this.to
          // If ref is same as what we originally stored then resolve
          ? res(fn())
          // If ref is not the same then reject the call
          : err(rej, 'Debounced')
        , ms
      )
    })
    .then(result => result)
    .catch(error => l('Script failed'))
  }
}

module.exports = new Successive()
