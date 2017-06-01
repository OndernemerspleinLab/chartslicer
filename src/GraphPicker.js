import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'
import { TablePickerResult } from './graphPickerSteps/TablePickerResult'
import { XAxis } from './graphPickerSteps/XAxis'
import { YAxis } from './graphPickerSteps/YAxis'
import { violet } from './colors'

const GraphPickerComp = glamorous.div(counterResetStyle, {
  maxWidth: '25rem',
  minHeight: '100vh',
  backgroundColor: violet.lightest,
  flex: '0 0 auto',
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
