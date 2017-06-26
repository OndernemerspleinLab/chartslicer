import { connect } from 'react-redux'
import { visibleDatasetInfoConnector } from '../connectors/visibleDatasetQueryConnector'
import { visibleCategoriesConnector } from '../connectors/categoryConnectors'
import { visibleTopicConnector } from '../connectors/topicConnectors'

export const visibleDataInfoEnhancer = connect(state => {
  const visibleDatasetInfo = visibleDatasetInfoConnector(state)
  const categories = visibleCategoriesConnector(state)
  const topic = visibleTopicConnector(state)

  return {
    ...visibleDatasetInfo,
    ...categories,
    ...topic,
  }
})
