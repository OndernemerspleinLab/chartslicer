import React from 'react'
import { compose } from 'recompose'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { InsideMargin } from './graphPickerSteps/Elements'
import { fadeInAnimation } from './styles'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { visibleDataInfoEnhancer } from './enhancers/visibleDataInfoEnhancer'

const enhancer = compose(onlyWhenVisibleDataset, visibleDataInfoEnhancer)

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
