import { connect } from 'react-redux'
import { merge, get } from '../helpers/getset'
import {
  topicsGetConnector,
  topicGroupsGetConnector,
  selectedTopicListConnector,
} from '../connectors/topicConnectors'
import {
  configGetInConnector,
  multiDimensionConnector,
} from '../connectors/configConnectors'
import { isAccordion, accordionEnhancer } from './accordionEnhancer'
import { compose } from 'recompose'
import { flatten } from 'lodash/fp'

export const topicEnhancer = connect((state, { topicKey }) => {
  const topic = topicsGetConnector(topicKey)(state)
  const { multiDimension } = multiDimensionConnector(state)
  const isMultiDimension = multiDimension === 'topic'
  const value = configGetInConnector(['topicKeys'])(state)

  return merge(topic)({
    isMultiDimension,
    replaceValue: !isMultiDimension,
    multiValue: true,
    inputValue: topic.key,
    name: 'topicKey',
    keyPath: ['topicKeys'],
    maxLength: 3,
    value,
  })
})

export const topicGroupEnhancer = compose(
  connect((state, { topicGroupId }) => {
    const props = topicGroupsGetConnector(topicGroupId)(state)
    const { selectedTopics = [] } = selectedTopicListConnector(state)
    const parentGroupIds = flatten(
      selectedTopics.map(
        selectedTopic => get('parentGroupIds')(selectedTopic) || []
      )
    )
    const includesSelection = parentGroupIds.includes(topicGroupId)

    return {
      asAccordion: isAccordion({
        id: topicGroupId,
        lists: [props.topics],
      }),
      includesSelection,
      ...props,
    }
  }),
  accordionEnhancer
)
