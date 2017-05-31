import React from 'react'
import {
  Step,
  StepTitle,
  Label,
  Radio,
  Form,
  FormRow,
  NumberInput,
  InputQuantifier,
} from './Elements'
import { connectPeriodTypes } from '../reducers/datasetsReducer'
import { onlyWhenLoaded, connectConfigChange } from '../higherOrderComponents'
import { Media, MediaFigure, MediaText } from '../Media'
import { connectConfigValues } from '../reducers/configReducer'
import { marginBottomHalfStyle } from '../marginStyle'

const PeriodTypeRadioComp = ({ inputValue, onChange, name, value }) => (
  <Radio
    id={`xAxis-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {inputValue}
  </Radio>
)

const PeriodTypeRadio = connectConfigChange(PeriodTypeRadioComp)

const PeriodTypePickerContainer = ({ periodTypes }) => (
  <FormRow>
    <Label>Toon periode per</Label>
    {periodTypes.map(periodType => (
      <PeriodTypeRadio
        key={periodType}
        name="periodType"
        inputValue={periodType}
      />
    ))}
  </FormRow>
)

const PeriodLengthInput = connectConfigChange(NumberInput)

const PeriodTypePicker = connectPeriodTypes(PeriodTypePickerContainer)

const PeriodLengthPickerComp = ({ periodType }) => (
  <FormRow>
    <Label css={marginBottomHalfStyle} htmlFor="periodLength">
      Toon de afgelopen
    </Label>
    <Media alignItems="center">
      <MediaFigure>
        <PeriodLengthInput name="periodLength" />
      </MediaFigure>
      <MediaText>
        <InputQuantifier htmlFor="periodLength">{periodType}</InputQuantifier>
      </MediaText>
    </Media>
  </FormRow>
)
const PeriodLengthPicker = connectConfigValues('periodType')(
  PeriodLengthPickerComp
)

export const XAxis = onlyWhenLoaded(() => (
  <Step>
    <StepTitle>Configureer de x-as</StepTitle>
    <Form>
      <PeriodTypePicker />
      <PeriodLengthPicker />
    </Form>
  </Step>
))
