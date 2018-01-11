// @flow

import { pick } from 'lodash/fp'
import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
} from './connectorHelpers'
import type { State, Key } from '../store/stateShape'
import { visibleDatasetInfoConnector } from './visibleDatasetQueryConnector'
import { getIn, set } from '../helpers/getset'
import { configGetInConnector, configConnector } from './configConnectors'
import { first } from 'lodash/fp'

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

export const visibleTopicConnector = (state: State) => {
  const topicKeys =
    getIn(['topicKeys'])(visibleDatasetInfoConnector(state)) || []

  return {
    topics: topicKeys.map(topicKey => topicsGetConnector(topicKey)(state)),
  }
}

export const selectedTopicListConnector = (state: State) => {
  const topicKeys = configGetInConnector(['topicKeys'])(state)

  return {
    selectedTopics: topicKeys.map(topicKey => {
      return topicsGetConnector(topicKey)(state)
    }),
  }
}

const pickFromSelectedTopic = pick(['key', 'title', 'unit', 'decimals'])

export const selectedTopicsConnector = (state: State) => {
  const { topicKeys = [] } = configConnector(state)

  return {
    selectedTopics: topicKeys.reduce((memo, topicKey) => {
      return set(
        topicKey,
        pickFromSelectedTopic(topicsGetConnector(topicKey)(state))
      )(memo)
    }, {}),
  }
}

export const selectedUnitAndDecimalsConnector = (state: State) => {
  const { topicKeys = [] } = configConnector(state)
  const firstTopicKey = first(topicKeys)

  return pick(['unit', 'decimals'])(topicsGetConnector(firstTopicKey)(state))
}
