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
import { Media, MediaFigure, MediaText } from '../Media'
import { marginBottomHalfStyle } from '../marginStyle'
import {
  configPickConnector,
  configMapConnector,
} from '../connectors/configConnectors'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { tableInfoPickConnector } from '../connectors/tableInfoConnectors'
import { connect } from 'react-redux'
import { composeConnectors } from '../connectors/connectorHelpers'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { compose } from 'recompose'

const PeriodTypeRadioComp = ({ inputValue, onChange, name, value }) =>
  <Radio
    id={`xAxis-${inputValue}`}
    name={name}
    value={inputValue}
    onChange={onChange}
    checked={value === inputValue}
  >
    {inputValue}
  </Radio>

const PeriodTypeRadio = configChangeEnhancer(PeriodTypeRadioComp)

const PeriodTypePickerContainer = ({ periodTypes, value }) =>
  <FormRow>
    <Label>Toon periode per</Label>
    {periodTypes.map(periodType =>
      <PeriodTypeRadio
        key={periodType}
        name="periodType"
        keyPath={['periodType']}
        inputValue={periodType}
        value={value}
      />
    )}
  </FormRow>

const periodLengthPickerEnhancer = compose(
  connect(configMapConnector({ value: ['periodLength'] })),
  configChangeEnhancer
)

const PeriodLengthInput = periodLengthPickerEnhancer(NumberInput)

const periodTypePickerEnhancer = connect(
  composeConnectors(
    configMapConnector({ value: ['periodType'] }),
    tableInfoPickConnector(['periodTypes'])
  )
)

const PeriodTypePicker = periodTypePickerEnhancer(PeriodTypePickerContainer)

const PeriodLengthPickerComp = ({ periodType }) =>
  <FormRow>
    <Label css={marginBottomHalfStyle} htmlFor="periodLength">
      Toon de afgelopen
    </Label>
    <Media alignItems="center">
      <MediaFigure>
        <PeriodLengthInput
          id="periodLength"
          name="periodLength"
          keyPath={['periodLength']}
        />
      </MediaFigure>
      <MediaText>
        <InputQuantifier htmlFor="periodLength">{periodType}</InputQuantifier>
      </MediaText>
    </Media>
  </FormRow>
const PeriodLengthPicker = connect(configPickConnector(['periodType']))(
  PeriodLengthPickerComp
)

export const XAxis = onlyWhenMetadataLoaded(() =>
  <Step>
    <StepTitle>Configureer de x-as</StepTitle>
    <Form>
      <PeriodTypePicker />
      <PeriodLengthPicker />
    </Form>
  </Step>
)
