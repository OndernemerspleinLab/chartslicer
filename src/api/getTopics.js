// @flow

import type { DatasetId, Topics, Topic } from '../store/stateShape'
import type { CbsDataProperties } from './getCbsDataPropertiesPromise'
import type { CbsTopic } from './apiShape'
import { set } from '../helpers/getset'

const topicMapper = ({ Key, Title, Unit, Decimals }: CbsTopic): Topic => ({
  key: Key,
  title: Title,
  unit: Unit,
  decimals: Decimals,
})

const topicReducer = (memo, topic) => set(topic.Key, topicMapper(topic))(memo)

const reduceCbsTopics = (cbsTopics: CbsTopic[]) => {
  return cbsTopics.reduce(topicReducer, {})
}

export const getTopics = (id: DatasetId) => ({
  Topic,
}: CbsDataProperties): Topics => ({ id, ...reduceCbsTopics(Topic) })
