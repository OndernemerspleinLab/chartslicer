import { DATASET_ID_SELECTED, INVALID_DATASET_ID_SELECTED } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'

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
