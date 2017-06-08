import { connect } from 'react-redux'
import { merge } from '../helpers/getset'
import {
  topicsGetConnector,
  topicGroupsGetConnector,
} from '../connectors/topicConnectors'
import { configGetInConnector } from '../connectors/configConnectors'

export const topicEnhancer = connect((state, { topicKey }) => {
  const topic = topicsGetConnector(topicKey)(state)
  const value = configGetInConnector(['topicKey', 0])(state)

  return merge(topic)({
    replaceValue: true,
    multiValue: true,
    inputValue: topic.key,
    name: 'topicKey',
    keyPath: ['topicKey'],
    value,
  })
})

export const topicGroupEnhancer = connect((state, { topicGroupId }) => {
  return topicGroupsGetConnector(topicGroupId)(state)
})
