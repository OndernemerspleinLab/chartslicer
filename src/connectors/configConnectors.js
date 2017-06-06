import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
} from './connectorHelpers'
// @flow

// GETTERS
export const configConnector = getActiveSubstate('config')

export const configPickConnector = pickFromActiveSubstate(configConnector)

export const configMapConnector = mapFromActiveSubstate(configConnector)
