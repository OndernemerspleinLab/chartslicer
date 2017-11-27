import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'
import { TablePickerResult } from './graphPickerSteps/TablePickerResult'
import { XAxis } from './graphPickerSteps/XAxis'
import { TopicPicker } from './graphPickerSteps/TopicPicker'
import { violet } from './colors'
import { mqBig, sidebarWidth, mqSmall } from './config'
import { connect } from 'react-redux'
import { orderedDimensionsConnector } from './connectors/dimensionConnectors'
import { CategoryPicker } from './graphPickerSteps/CategoryPicker'
import { MultiDimensionPicker } from './graphPickerSteps/MultiDimensionPicker'

const GraphPickerComp = glamorous.div(counterResetStyle, {
  backgroundColor: violet.lightest,
  flex: '0 0 auto',
  [mqSmall]: {
    borderBottom: `2px solid ${violet.default}`,
  },
  [mqBig]: {
    width: sidebarWidth,
    minHeight: '100vh',
    height: '100%',
  },
})

const GraphPickerContainer = ({ dimensionKeys = [] }) => (
  <GraphPickerComp>
    <Intro />
    <TablePicker />
    <TablePickerResult />
    <MultiDimensionPicker />
    <XAxis />
    <TopicPicker />
    {dimensionKeys.map(dimensionKey => (
      <CategoryPicker dimensionKey={dimensionKey} key={dimensionKey} />
    ))}
  </GraphPickerComp>
)

export const GraphPicker = connect(orderedDimensionsConnector)(
  GraphPickerContainer
)
