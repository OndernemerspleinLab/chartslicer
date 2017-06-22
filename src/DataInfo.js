import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { connect } from 'react-redux'
import { topicsGetConnector } from './connectors/topicConnectors'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { visibleDatasetInfoConnector } from './connectors/visibleDatasetQueryConnector'
import { getIn } from './helpers/getset'
import { categoriesGetInConnector } from './connectors/categoryConnectors'

const dataInfoConnector = connect(state => {
  const visibleDatasetInfo = visibleDatasetInfoConnector(state)
  const topicKey = getIn(['topicKeys', 0])(visibleDatasetInfo)
  const categories = Object.entries(
    visibleDatasetInfo.categoryKeys
  ).map(([dimensionKey, [categoryKey]]) => {
    return categoriesGetInConnector([dimensionKey, categoryKey])(state)
  })

  return {
    visibleDatasetInfo,
    categories,
    topic: topicsGetConnector(topicKey)(state),
  }
})

const enhancer = compose(onlyWhenVisibleDataset, dataInfoConnector)

const DataInfoComp = glamorous.div({
  padding: '0 3rem',
  backgroundColor: hemelblauw.lighter,
  animation: fadeInAnimation,
  maxWidth: '60rem',
})

const TitleComp = glamorous.h1({
  color: hemelblauw.default,
  fontSize: '2.2rem',
  lineHeight: '1.2',
  margin: '0 0 1rem 0',
})

const Categories = glamorous.h2({})
const Category = glamorous.div({})
const DataInfoContainer = ({ topic: { title }, categories }) =>
  <DataInfoComp>
    <InsideMargin top="1.4rem" bottom="2rem">
      <TitleComp>{title}</TitleComp>
      <Categories>
        {categories.map(({ key, title }) =>
          <Category key={key}>{title}</Category>
        )}
      </Categories>
    </InsideMargin>
  </DataInfoComp>

export const DataInfo = enhancer(DataInfoContainer)
