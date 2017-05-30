import { DATASET_ID_SELECTED, INVALID_DATASET_ID_SELECTED } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from '../getset'

const activeDatasetReducer = (state, { id }) => id

const activeDatasetReducerSelector = compose(
  reduceIn('activeDatasetId'),
  defaultState(null)
)

export const reduceActiveDataset = compose(
  activeDatasetReducerSelector,
  reduceFor(DATASET_ID_SELECTED)
)(activeDatasetReducer)

const invalidActiveIdReducer = (state, { input }) => input

export const reduceInvalidActiveId = compose(
  activeDatasetReducerSelector,
  reduceFor(INVALID_DATASET_ID_SELECTED)
)(invalidActiveIdReducer)

export const connectActiveDataset = connect(
  ({ activeDatasetId, datasets }) => ({
    activeDataset: get(activeDatasetId)(datasets),
  })
)
