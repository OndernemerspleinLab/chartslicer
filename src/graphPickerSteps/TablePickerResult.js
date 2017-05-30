import React from 'react'
import glamorous from 'glamorous'
import { get } from '../getset'
import {
  compose,
  pure,
  branch,
  renderComponent,
  renderNothing,
} from 'recompose'
import { existing } from '../helpers'
import {
  connectActiveDatasetsNetworkState,
} from '../reducers/networkStateReducer'
import { connectActiveDataset } from '../reducers/datasetsReducer'
import { Message, ErrorMessage, StepTitle, Paragraph } from './Elements'

const connectData = compose(
  connectActiveDatasetsNetworkState('error', 'loaded'),
  connectActiveDataset({ title: ['tableInfo', 'ShortTitle'], id: ['id'] })
)

const TablePickerResultContainer = ({ title, id }) => (
  <Message>
    <StepTitle>{title}</StepTitle>
    <Paragraph>Dataset ID: <code>{id}</code></Paragraph>
  </Message>
)

const ResultError = ({ error }) => (
  <ErrorMessage>
    <StepTitle>Het ophalen van de dataset is mislukt</StepTitle>
    <Paragraph>Foutmelding: <code>{get('message')(error)}</code></Paragraph>
  </ErrorMessage>
)

const errorHoc = branch(
  ({ error }) => existing(error),
  renderComponent(ResultError)
)

const nothingHoc = branch(({ loaded }) => !loaded, renderNothing)

const enhancer = compose(connectData, pure, errorHoc, nothingHoc)

export const TablePickerResult = enhancer(TablePickerResultContainer)
