import React from 'react'
import { get } from '../getset'
import { compose, branch, renderComponent } from 'recompose'
import { existing } from '../helpers'
import {
  connectActiveDatasetsNetworkState,
} from '../reducers/networkStateReducer'
import { connectActiveDataset } from '../reducers/datasetsReducer'
import {
  Message,
  ErrorMessage,
  StepTitle,
  Paragraph,
  InlineTerm,
} from './Elements'
import { onlyWhenLoaded } from '../higherOrderComponents'

const connectData = compose(
  connectActiveDatasetsNetworkState('error'),
  connectActiveDataset({ title: ['tableInfo', 'ShortTitle'], id: ['id'] })
)

const TablePickerResultContainer = ({ title, id }) => (
  <Message>
    <StepTitle>{title}</StepTitle>
    <Paragraph>
      <InlineTerm>Dataset ID:</InlineTerm> <code>{id}</code>
    </Paragraph>
  </Message>
)

const ResultError = ({ error }) => (
  <ErrorMessage>
    <StepTitle>Het ophalen van de dataset is niet gelukt</StepTitle>
    <Paragraph>
      <InlineTerm>Foutmelding:</InlineTerm> <code>{get('message')(error)}</code>
    </Paragraph>
  </ErrorMessage>
)

const errorHoc = branch(
  ({ error }) => existing(error),
  renderComponent(ResultError)
)

const enhancer = compose(connectData, errorHoc, onlyWhenLoaded)

export const TablePickerResult = enhancer(TablePickerResultContainer)
