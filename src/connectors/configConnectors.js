import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
  getInFromActiveSubstate,
} from './connectorHelpers'

// GETTERS
export const configConnector = getActiveSubstate('config')

export const configGetConnector = getFromActiveSubstate(configConnector)

export const configGetInConnector = getInFromActiveSubstate(configConnector)

export const configPickConnector = pickFromActiveSubstate(configConnector)

export const configMapConnector = mapFromActiveSubstate(configConnector)

export const multiDimensionConnector = configPickConnector(['multiDimension'])
