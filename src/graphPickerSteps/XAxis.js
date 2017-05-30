import React from 'react'
import { Step, StepTitle, Label, Radio } from './Elements'
import { connectPeriodTypes } from '../reducers/datasetsReducer'
import glamorous from 'glamorous'
import { onlyWhenLoaded, connectConfigChange } from '../higherOrderComponents'

const PeriodTypePickerForm = glamorous.form()

const PeriodTypeRadioComp = ({ periodType, onChange, name, value }) => (
  <Radio
    id={`xAxis-${periodType}`}
    name={name}
    value={periodType}
    onChange={onChange}
    checked={value === periodType}
  >
    {periodType}
  </Radio>
)

const PeriodTypeRadio = connectConfigChange(PeriodTypeRadioComp)

const PeriodTypePickerContainer = ({ periodTypes }) => (
  <PeriodTypePickerForm>
    <Label>Toon periode per</Label>
    {periodTypes.map(periodType => (
      <PeriodTypeRadio
        key={periodType}
        name="periodType"
        periodType={periodType}
      />
    ))}
  </PeriodTypePickerForm>
)

const PeriodTypePicker = connectPeriodTypes(PeriodTypePickerContainer)

export const XAxis = onlyWhenLoaded(() => (
  <Step>
    <StepTitle>Configureer de x-as</StepTitle>
    <PeriodTypePicker />
  </Step>
))
