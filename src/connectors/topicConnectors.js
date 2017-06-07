// @flow

import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
} from './connectorHelpers'

export const topicsConnector = getActiveSubstate('topics')

export const topicsGetConnector = getFromActiveSubstate(topicsConnector)

export const topicsPickConnector = pickFromActiveSubstate(topicsConnector)

export const topicsMapConnector = mapFromActiveSubstate(topicsConnector)

export const topicGroupsConnector = getActiveSubstate('topicGroups')

export const topicGroupsGetConnector = getFromActiveSubstate(
  topicGroupsConnector
)

export const topicGroupsPickConnector = pickFromActiveSubstate(
  topicGroupsConnector
)

export const topicGroupsMapConnector = mapFromActiveSubstate(
  topicGroupsConnector
)
