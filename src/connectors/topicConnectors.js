// @flow

import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
} from './connectorHelpers'
import type { State, Key } from '../store/stateShape'

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

export const topicConnector = (state: State, { topicKey }: { topicKey: Key }) =>
  topicsGetConnector(topicKey)(state)
