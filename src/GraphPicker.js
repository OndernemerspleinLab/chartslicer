import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'
import { TablePickerResult } from './graphPickerSteps/TablePickerResult'
import { XAxis } from './graphPickerSteps/XAxis'

const GraphPickerComp = glamorous.div(counterResetStyle, {
  maxWidth: '25rem',
})

export const GraphPicker = () => (
  <GraphPickerComp>
    <Intro />
    <TablePicker />
    <TablePickerResult />
    <XAxis />
  </GraphPickerComp>
)