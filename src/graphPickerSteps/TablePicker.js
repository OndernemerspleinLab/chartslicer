import React from 'react'
import { StepTitle, Step } from './Elements'
import { TablePickerInput } from './TablePickerInput'

export const TablePicker = () => (
  <Step>
    <StepTitle>Plak de URL of de ID van de dataset hier</StepTitle>
    <TablePickerInput />
  </Step>
)
