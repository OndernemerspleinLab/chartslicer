import { connect } from 'react-redux'
import { merge, get } from '../helpers/getset'
import {
  topicsGetConnector,
  topicGroupsGetConnector,
  selectedTopicListConnector,
  selectedUnitAndDecimalsConnector,
} from '../connectors/topicConnectors'
import {
  configGetInConnector,
  multiDimensionConnector,
  topicLabelAliasConnector,
} from '../connectors/configConnectors'
import { isAccordion, accordionEnhancer } from './accordionEnhancer'
import { compose } from 'recompose'
import { flatten } from 'lodash/fp'
import { unexisting } from '../helpers/helpers'
import { maxDimensions, DIMENSION_TOPIC } from '../config'

const canSelectTopic = ({
  topicUnit,
  selectedUnit,
  selectedDecimals,
  topicDecimals,
}) =>
  (unexisting(selectedUnit) && unexisting(selectedUnit)) ||
  (selectedUnit === topicUnit && selectedDecimals === topicDecimals)

export const topicEnhancer = connect((state, { topicKey }) => {
  const topic = topicsGetConnector(topicKey)(state)
  const { multiDimension } = multiDimensionConnector(state)
  const isMultiDimension = multiDimension === DIMENSION_TOPIC
  const alias = topicLabelAliasConnector({ key: topicKey })(state)
  const value = configGetInConnector(['topicKeys'])(state)
  const {
    unit: selectedUnit,
    decimals: selectedDecimals,
  } = selectedUnitAndDecimalsConnector(state)
  const { unit: topicUnit, decimals: topicDecimals } = topic

  return merge(topic)({
    isMultiDimension,
    differentSelectionGroup:
      isMultiDimension &&
      !canSelectTopic({
        topicUnit,
        selectedUnit,
        selectedDecimals,
        topicDecimals,
      }),
    replaceValue:
      !isMultiDimension ||
      !canSelectTopic({
        topicUnit,
        selectedUnit,
        selectedDecimals,
        topicDecimals,
      }),
    multiValue: true,
    inputValue: topic.key,
    alias,
    name: 'topicKey',
    keyPath: ['topicKeys'],
    maxLength: maxDimensions,
    selectedUnit,
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
