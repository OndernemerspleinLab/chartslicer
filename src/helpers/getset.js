import * as timm from 'timm'
import { mapValues } from 'lodash/fp'

const functionalize = fn => (...args) => (object = {}) => fn(object, ...args)

export const {
  clone,
  addLast,
  addFirst,
  removeLast,
  removeFirst,
  insert,
  removeAt,
  replaceAt,
  getIn,
  set,
  setIn,
  updateIn,
  merge,
  mergeIn,
  omit,
  addDefaults,
} = mapValues(functionalize)(timm)

export const get = key => getIn([key])
export const update = (key, updater) => updateIn([key], updater)
