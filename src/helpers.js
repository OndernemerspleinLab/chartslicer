export const assign = (...sources) => (object = {}) =>
  Object.assign({}, object, ...sources)
