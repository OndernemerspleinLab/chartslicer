// @flow

import type {
  DatasetId,
  TopicGroups,
  TopicGroup,
  Key,
  Id,
} from '../store/stateShape'
import type { CbsDataProperties } from './getCbsDataPropertiesPromise'
import type { CbsTopicGroup } from './apiShape'
import { groupBy } from 'lodash/fp'
import { get, set } from '../getset'
import { existing } from '../helpers'

const defaultToRoot = id => (existing(id) ? id : 'root')

const groupByParentID = groupBy(({ ParentID }) => defaultToRoot(ParentID))

const getArrayFromMap = ID => map => get(ID)(map) || []

type KeyMap = { [string]: Key[] }
type IdMap = { [string]: Id[] }

const topicGroupMapper = ({
  topicMap,
  topicGroupMap,
  cbsTopicGroup: { ID, Title },
}: {
  topicMap: KeyMap,
  topicGroupMap: IdMap,
  cbsTopicGroup: CbsTopicGroup,
}): TopicGroup => ({
  id: ID,
  topics: getArrayFromMap(ID)(topicMap).map(get('Key')),
  topicGroups: getArrayFromMap(ID)(topicGroupMap).map(get('ID')),
  title: Title,
})

const topicGroupReducer = ({
  topicMap,
  topicGroupMap,
}: {
  topicMap: KeyMap,
  topicGroupMap: IdMap,
}) => (memo, cbsTopicGroup) =>
  set(
    cbsTopicGroup.ID,
    topicGroupMapper({
      topicMap,
      topicGroupMap,
      cbsTopicGroup,
    })
  )(memo)

const reduceCbsTopicGroups = ({
  Topic = [],
  TopicGroup = [],
}: CbsDataProperties) => {
  const topicMap: KeyMap = groupByParentID(Topic)
  const topicGroupMap: IdMap = groupByParentID(TopicGroup)

  return {
    root: topicGroupMapper({
      topicMap,
      topicGroupMap,
      cbsTopicGroup: {
        ID: 'root',
        Type: 'TopicGroup',
      },
    }),
    ...TopicGroup.reduce(topicGroupReducer({ topicMap, topicGroupMap }), {}),
  }
}

export const getTopicGroups = (id: DatasetId) => (
  cbsDataProperties: CbsDataProperties
): TopicGroups => ({ id, ...reduceCbsTopicGroups(cbsDataProperties) })
