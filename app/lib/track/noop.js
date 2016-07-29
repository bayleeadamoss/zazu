const self = {
  initialize: () => {},
  setName: () => {},
  setAttribute: () => {},
  addPageAction: () => {},
  noticeError: () => {},
  interaction: () => {
    return {
      setName: () => {},
      setAttribute: () => {},
      save: () => {},
      ignore: () => {},
    }
  },
  tracer: (name) => {
    return {
      error: () => {},
      complete: (data) => data,
    }
  },
}

module.exports = self
