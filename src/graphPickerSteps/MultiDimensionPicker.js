import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { Step, StepTitle, Form, FormRow } from './Elements'
import React from 'react'
import { orderedDimensionsConnector } from '../connectors/dimensionConnectors'
import { dimensionForKeyEnhancer } from '../enhancers/dimensionEnhancers'
import { connect } from 'react-redux'

const DimensionRadioComp = () => {
  return null
}
const DimensionRadio = dimensionForKeyEnhancer(DimensionRadioComp)

const MultiDimensionOptionsComp = ({ dimensionKeys = [] }) => {
  return <FormRow>{dimensionKeys.map(dimensionKey => {})}</FormRow>
}
const MultiDimensionOptions = connect(orderedDimensionsConnector)(
  MultiDimensionOptionsComp
)

export const MultiDimensionPicker = onlyWhenMetadataLoaded(() => (
  <Step>
    <StepTitle>Kies een dimensie om te vergelijken</StepTitle>
    <Form>
      <MultiDimensionOptions />
    </Form>
  </Step>
))
