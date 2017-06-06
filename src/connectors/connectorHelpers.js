/*@flow*/

import { pick, mapValues } from 'lodash/fp'
import { getIn, get } from '../getset'
import type { Key, State, Substate } from '../store/stateShape'

type SubstateConnector = State => Substate

const cache = new WeakMap()

export const weakMemoize = (fn: Function): Function => (
  arg: Function | Object
) => {
  if (!cache.has(arg)) {
    cache.set(arg, fn(arg))
  }

  return cache.get(arg)
}

///////// getActiveDatasetId /////////

export const getActiveDatasetId = get('activeDatasetId')

///////// getActiveSubstate /////////

export const getActiveSubstate = (substateKey: Key) =>
  weakMemoize((state: State): Substate => {
    return getIn([substateKey, getActiveDatasetId(state)])(state)
  })

///////// pickFromActiveSubstate /////////

export const pickFromActiveSubstate = (
  substateConnector: SubstateConnector
) => (keys: [Key]) =>
  weakMemoize((state: State) => {
    const substate = substateConnector(state)

    return pick(keys)(substate)
  })

///////// getPropsFromActiveSubstate /////////

const getValue = dataset => keyPath => getIn(keyPath)(dataset)

type KeyPathMap = {
  [Key]: [Key],
}

export const mapFromActiveSubstate = (substateConnector: SubstateConnector) => (
  keyPathMap: KeyPathMap
) =>
  weakMemoize((state: State) => {
    const substate = substateConnector(state)

    return mapValues(getValue(substate))(keyPathMap)
  })
