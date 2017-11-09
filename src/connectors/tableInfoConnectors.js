// @flow

import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
} from './connectorHelpers'

export const tableInfoConnector = getActiveSubstate('tableInfo')

export const tableInfoGetConnector = getFromActiveSubstate(tableInfoConnector)

export const tableLanguageGetter = tableInfoGetConnector('language')

export const tableInfoPickConnector = pickFromActiveSubstate(tableInfoConnector)

export const tableInfoMapConnector = mapFromActiveSubstate(tableInfoConnector)

export const tableLanguageConnector = tableInfoPickConnector(['language'])
