import React from 'react'
import { StepTitle, Step } from './Elements'
import { TablePickerInput } from './TablePickerInput'
import { TablePickerResult } from './TablePickerResult'

const urlExplanationText =
  'bijvoorbeeld ‘https://opendata.cbs.nl/#/CBS/nl/dataset/82439NED/line?graphtype=Line’'
const idExplanationText = 'bijvoorbeeld ‘82439NED’'
export const TablePicker = () => (
  <Step>
    <StepTitle>
      Plak de
      {' '}
      <abbr title={urlExplanationText}>URL</abbr>
      {' '}
      of de
      {' '}
      <abbr title={idExplanationText}>ID</abbr>
      {' '}
      van de dataset hier
    </StepTitle>
    <TablePickerInput />
    <TablePickerResult />
  </Step>
)
