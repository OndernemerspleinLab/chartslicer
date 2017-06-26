// @flow

import {
  getActiveSubstate,
  pickFromActiveSubstate,
  getFromActiveSubstate,
  mapFromActiveSubstate,
} from './connectorHelpers'

export const dimensionsConnector = getActiveSubstate('dimensions')

export const dimensionsGetConnector = getFromActiveSubstate(dimensionsConnector)

export const dimensionsPickConnector = pickFromActiveSubstate(
  dimensionsConnector
)
export const dimensionsMapConnector = mapFromActiveSubstate(dimensionsConnector)

export const orderedDimensionsConnector = dimensionsMapConnector({
  dimensionKeys: ['order'],
})
