import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'
import { TablePickerResult } from './graphPickerSteps/TablePickerResult'
import { XAxis } from './graphPickerSteps/XAxis'
import { TopicPicker } from './graphPickerSteps/TopicPicker'
import { violet } from './colors'
import { mqBig } from './config'
import { connect } from 'react-redux'
import { orderedDimensionsConnector } from './connectors/dimensionConnectors'
import { CategoryPicker } from './graphPickerSteps/CategoryPicker'

const GraphPickerComp = glamorous.div(counterResetStyle, {
  backgroundColor: violet.lightest,
  borderBottom: `2px solid ${violet.default}`,
  flex: '0 0 auto',
  [mqBig]: {
    maxWidth: '25rem',
    minHeight: '100vh',
    height: '100%',
    borderRight: `2px solid ${violet.default}`,
  },
})

const GraphPickerContainer = ({ dimensionKeys = [] }) =>
  <GraphPickerComp>
    <Intro />
    <TablePicker />
    <TablePickerResult />
    <XAxis />
    <TopicPicker />
    {dimensionKeys.map(dimensionKey =>
      <CategoryPicker dimensionKey={dimensionKey} key={dimensionKey} />
    )}
  </GraphPickerComp>

export const GraphPicker = connect(orderedDimensionsConnector)(
  GraphPickerContainer
)
