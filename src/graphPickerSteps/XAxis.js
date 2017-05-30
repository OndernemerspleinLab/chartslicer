import React from 'react'
import { Step, StepTitle, Label, Radio } from './Elements'
import { connectPeriodTypes } from '../reducers/datasetsReducer'
import glamorous from 'glamorous'
import { onlyWhenLoaded } from '../higherOrderComponents'

const PeriodTypePickerComp = glamorous.form()

const renderPeriodTypeRadio = periodType => (
  <Radio
    key={periodType}
    id={`xAxis-${periodType}`}
    name="xAxisPeriodType"
    value={periodType}
  >
    {periodType}
  </Radio>
)

const PeriodTypePickerContainer = ({ periodTypes }) => (
  <PeriodTypePickerComp>
    <Label>Toon periode per</Label>
    {periodTypes.map(renderPeriodTypeRadio)}
  </PeriodTypePickerComp>
)

const PeriodTypePicker = connectPeriodTypes(PeriodTypePickerContainer)

export const XAxis = onlyWhenLoaded(() => (
  <Step>
    <StepTitle>Configureer de x-as</StepTitle>
    <PeriodTypePicker />
  </Step>
))
