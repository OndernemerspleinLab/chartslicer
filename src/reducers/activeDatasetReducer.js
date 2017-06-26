/* @flow */

import {
  DATASET_ID_SELECTED,
  INVALID_DATASET_ID_SELECTED,
  DATASET_ID_CLEARED,
} from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import type { MaybeDatasetId } from '../store/stateShape'

///////// Selector /////////

const activeDatasetSelector = compose(
  reduceIn('activeDatasetId'),
  defaultState(null)
)

///////// Reduce valid id /////////

const setValidId = (state, { id }): MaybeDatasetId => id

const validActiveDatasetReducer = compose(
  activeDatasetSelector,
  reduceFor(DATASET_ID_SELECTED)
)(setValidId)

///////// Reduce invalid id /////////

const setInvalidId = (state, { input }): MaybeDatasetId => input

const invalidActiveIdReducer = compose(
  activeDatasetSelector,
  reduceFor(INVALID_DATASET_ID_SELECTED)
)(setInvalidId)

///////// Reduce cleared id /////////

const clearId = (): MaybeDatasetId => null

const clearedActiveDatasetReducer = compose(
  activeDatasetSelector,
  reduceFor(DATASET_ID_CLEARED)
)(clearId)

///////// Reducer /////////

export const activeDatasetReducer = composeReducers(
  validActiveDatasetReducer,
  invalidActiveIdReducer,
  clearedActiveDatasetReducer
)
