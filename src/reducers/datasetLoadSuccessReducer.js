import { merge } from 'lodash/fp'
import { DATASET_LOAD_SUCCESS } from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'recompose'
import { setIn, update } from '../helpers/getset'

const reduceDatasetLoadingStateSuccess = (state, { id, query }) => {
  return setIn([id, query], {
    loading: false,
    loaded: true,
    error: null,
    id,
    query,
  })(state)
}

const datasetLoadingStateSuccessReducer = compose(
  reduceIn('dataQueryLoadingState'),
  defaultState({}),
  reduceFor(DATASET_LOAD_SUCCESS)
)(reduceDatasetLoadingStateSuccess)

const mergeDataEntry = (entries, dataEntry = {}) =>
  update(dataEntry.id, merge(dataEntry))(entries)

const mergeDataEntries = ({ id, query, periodType, dataEntries = [] }) => (
  entries = {}
) => {
  return dataEntries.reduce(mergeDataEntry, entries)
}

const reduceDataEntries = (state, action) => {
  return update(action.id, mergeDataEntries(action))(state)
}

const datasetEntriesReducer = compose(
  reduceIn('dataEntries'),
  defaultState({}),
  reduceFor(DATASET_LOAD_SUCCESS)
)(reduceDataEntries)

export const datasetLoadSuccessReducer = composeReducers(
  datasetEntriesReducer,
  datasetLoadingStateSuccessReducer
)
