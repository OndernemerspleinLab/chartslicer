import React from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
import { getIn, get } from '../getset'
import {
  compose,
  pure,
  branch,
  renderComponent,
  renderNothing,
} from 'recompose'
import { existing } from '../helpers'

const TablePickerResultComp = glamorous.div()

const connectData = connect(
  ({ datasets, datasetsNetworkState, activeDatasetId }) => {
    const tableInfo = getIn([activeDatasetId, 'tableInfo'])(datasets)
    const error = getIn([activeDatasetId, 'error'])(datasetsNetworkState)
    const loaded = getIn([activeDatasetId, 'loaded'])(datasetsNetworkState)

    return {
      activeDatasetId,
      title: get('ShortTitle')(tableInfo),
      error,
      loaded,
    }
  }
)

const TablePickerResultContainer = ({ title }) => (
  <TablePickerResultComp>Dataset: ‘{title}’</TablePickerResultComp>
)

const ResultErrorComp = glamorous.div({})

const ResultError = ({ error }) => (
  <ResultErrorComp>Helaas: {get('message')(error)}</ResultErrorComp>
)

const errorHoc = branch(
  ({ error }) => existing(error),
  renderComponent(ResultError)
)

const nothingHoc = branch(({ loaded }) => !loaded, renderNothing)

const enhancer = compose(connectData, pure, errorHoc, nothingHoc)

export const TablePickerResult = enhancer(TablePickerResultContainer)
