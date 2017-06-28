// @flow

import type {
  DatasetId,
  Topics,
  Topic,
  TopicGroups,
  TopicGroupId,
} from '../store/stateShape'
import type { CbsDataProperties } from './getCbsDataPropertiesPromise'
import type { CbsTopic } from './apiShape'
import { set, getIn } from '../helpers/getset'
import { existing } from '../helpers/helpers'

const getParentTopicGroups = ({
  parentId,
  topicGroups,
}: {
  parentId: ?TopicGroupId,
  topicGroups: TopicGroups,
}): TopicGroupId[] => {
  const memo = []
  let nextParentId = parentId

  while (existing(nextParentId)) {
    memo.push(((nextParentId: any): TopicGroupId))

    nextParentId = getIn([nextParentId, 'parentId'])(topicGroups)
  }

  return memo
}

const topicMapper = ({
  topic: { Key, Title, Unit, Decimals, ParentID },
  topicGroups,
}: {
  topic: CbsTopic,
  topicGroups: TopicGroups,
}): Topic => ({
  key: Key,
  title: Title,
  unit: Unit,
  decimals: Decimals,
  parentGroupIds: getParentTopicGroups({ parentId: ParentID, topicGroups }),
})

const topicReducer = topicGroups => (memo, topic) =>
  set(topic.Key, topicMapper({ topic, topicGroups }))(memo)

const reduceCbsTopics = ({
  cbsTopics,
  topicGroups,
}: {
  cbsTopics: CbsTopic[],
  topicGroups: TopicGroups,
}) => {
  return cbsTopics.reduce(topicReducer(topicGroups), {})
}

export const getTopics = (id: DatasetId) => ({
  cbsDataProperties: { Topic },
  topicGroups,
}: {
  cbsDataProperties: CbsDataProperties,
  topicGroups: TopicGroups,
}): Topics => ({ id, ...reduceCbsTopics({ cbsTopics: Topic, topicGroups }) })
