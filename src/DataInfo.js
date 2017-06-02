import React from 'react'
import { find, flatten } from 'lodash/fp'
import { compose } from 'recompose'
import { onlyWhenLoaded } from './higherOrderComponents'
import glamorous from 'glamorous'
import { getFromActiveDataset } from './reducers/datasetsReducer'
import { hemelblauw } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { getConfigValues } from './reducers/configReducer'
import { connect } from 'react-redux'

const findTopic = topicKey => find(({ Key }) => Key === topicKey)
const connectDataInfo = connect(state => {
  const { topicKey } = getConfigValues('topicKey')(state)
  const { topics } = getFromActiveDataset({
    topics: ['dataProperties', 'Topic'],
  })(state)

  const topic = compose(findTopic(topicKey), flatten, Object.values)(topics)

  return topic || {}
})
const enhancer = compose(onlyWhenLoaded, connectDataInfo)

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

const DataTableContainer = ({ Title }) => (
  <DataInfoComp>
    <InsideMargin top="1.4rem" bottom="2rem">
      <TitleComp>{Title}</TitleComp>
    </InsideMargin>
  </DataInfoComp>
)

export const DataInfo = enhancer(DataTableContainer)
