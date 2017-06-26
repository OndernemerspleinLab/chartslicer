import { connect } from 'react-redux'
import { merge } from '../helpers/getset'
import {
  topicsGetConnector,
  topicGroupsGetConnector,
} from '../connectors/topicConnectors'
import { configGetInConnector } from '../connectors/configConnectors'
import { isAccordion, accordionEnhancer } from './accordionEnhancer'
import { compose } from 'recompose'

export const topicEnhancer = connect((state, { topicKey }) => {
  const topic = topicsGetConnector(topicKey)(state)
  const value = configGetInConnector(['topicKeys', 0])(state)

  return merge(topic)({
    replaceValue: true,
    multiValue: true,
    inputValue: topic.key,
    name: 'topicKey',
    keyPath: ['topicKeys'],
    value,
  })
})

export const topicGroupEnhancer = compose(
  connect((state, { topicGroupId }) => {
    const props = topicGroupsGetConnector(topicGroupId)(state)

    return {
      asAccordion: isAccordion({
        id: topicGroupId,
        lists: [props.topics, props.topicGroups],
      }),
      ...props,
    }
  }),
  accordionEnhancer
)
