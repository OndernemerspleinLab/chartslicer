import { connect } from 'react-redux'
import { merge } from '../helpers/getset'
import {
  topicsGetConnector,
  topicGroupsGetConnector,
} from '../connectors/topicConnectors'
import { configGetConnector } from '../connectors/configConnectors'

export const topicEnhancer = connect((state, { topicKey }) => {
  const topic = topicsGetConnector(topicKey)(state)
  const value = configGetConnector('topicKey')(state)

  return merge(topic)({
    inputValue: topic.key,
    name: 'topicKey',
    keyPath: ['topicKey'],
    value,
  })
})

export const topicGroupEnhancer = connect((state, { topicGroupId }) => {
  return topicGroupsGetConnector(topicGroupId)(state)
})
