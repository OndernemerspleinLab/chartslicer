import glamorous from 'glamorous'
import React from 'react'
import { Intro } from './graphPickerSteps/Intro'
import { counterResetStyle } from './graphPickerSteps/counterStyle'
import { TablePicker } from './graphPickerSteps/TablePicker'

const GraphPickerComp = glamorous.div(counterResetStyle, {
  maxWidth: '25rem',
})

export const GraphPicker = () => (
  <GraphPickerComp>
    <Intro />
    <TablePicker />
  </GraphPickerComp>
)
