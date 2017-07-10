import { existing } from './../helpers/helpers'
/*@flow*/

import { pick, mapValues } from 'lodash/fp'
import { getIn, get, merge } from '../helpers/getset'
import type { Key, KeyPath, State, Substate } from '../store/stateShape'
import { weakMemoize } from '../helpers/weakMemoize'

///////// getActiveDatasetId /////////

export const getActiveDatasetId = get('activeDatasetId')

///////// getActiveSubstate /////////

type SubstateConnector = State => Substate

export const getActiveSubstate = (substateKey: Key): SubstateConnector =>
  weakMemoize(state => {
    return getIn([substateKey, getActiveDatasetId(state)])(state)
  })

///////// getFromActiveSubstate /////////

export const getFromActiveSubstate = (substateConnector: SubstateConnector) => (
  key: Key
): SubstateConnector =>
  weakMemoize(state => {
    const substate = substateConnector(state)

    const result = get(key)(substate)

    return existing(result) ? result : {}
  })

///////// getInFromActiveSubstate /////////

export const getInFromActiveSubstate = (
  substateConnector: SubstateConnector
) => (keyPath: KeyPath): SubstateConnector =>
  weakMemoize(state => {
    const substate = substateConnector(state)

    const result = getIn(keyPath)(substate)

    return existing(result) ? result : {}
  })

///////// pickFromActiveSubstate /////////

export const pickFromActiveSubstate = (
  substateConnector: SubstateConnector
) => (keys: [Key]): SubstateConnector =>
  weakMemoize(state => {
    const substate = substateConnector(state)

    return pick(keys)(substate) || {}
  })

///////// mapFromActiveSubstate /////////

const getValue = dataset => keyPath => getIn(keyPath)(dataset)

type KeyPathMap = {
  [Key]: [Key],
}

export const mapFromActiveSubstate = (substateConnector: SubstateConnector) => (
  keyPathMap: KeyPathMap
): SubstateConnector =>
  weakMemoize(state => {
    const substate = substateConnector(state)

    return mapValues(getValue(substate))(keyPathMap) || {}
  })

///////// composeConnectors /////////

type Connector = (state: State, ownProps: Object) => Object

export const composeConnectors = (...reducers: Connector[]): Connector =>
  reducers.length === 0
    ? (state: State) => state
    : reducers.reduce((a, b) => (state, ownProps) => {
        const newProps = merge(ownProps)(b(state, ownProps))

        return merge(newProps)(a(state, newProps))
      })
