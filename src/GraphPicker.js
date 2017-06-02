import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'
import { TablePickerResult } from './graphPickerSteps/TablePickerResult'
import { XAxis } from './graphPickerSteps/XAxis'
import { YAxis } from './graphPickerSteps/YAxis'
import { violet } from './colors'
import { mqBig } from './config'

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

export const GraphPicker = () => (
  <GraphPickerComp>
    <Intro />
    <TablePicker />
    <TablePickerResult />
    <XAxis />
    <YAxis />
  </GraphPickerComp>
)
