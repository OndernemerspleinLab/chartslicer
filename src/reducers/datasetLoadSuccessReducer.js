import { merge, pluck } from 'lodash/fp'
import { DATASET_LOAD_SUCCESS } from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'recompose'
import { setIn, update } from '../helpers/getset'
import { activeDatasetGetQueryConnectorFor } from '../connectors/activeDatasetQueryConnector'

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

const mergeDataEntries = ({ id, query, dataEntries = [] }) => (
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

const getDataQueryState = ({ query, config, dataEntries }) => {
  return Object.assign(
    {
      query,
      dataList: pluck('id')(dataEntries),
    },
    config
  )
}

const reduceDatasetQueries = (state, action) => {
  return setIn([action.id, action.query], getDataQueryState(action))(state)
}

const datasetQueriesReducer = compose(
  reduceIn('dataQueries'),
  defaultState({}),
  reduceFor(DATASET_LOAD_SUCCESS)
)(reduceDatasetQueries)

const reduceVisibleDatasetQuery = (state, { id, query }) => {
  const activeDatasetQuery = activeDatasetGetQueryConnectorFor(id)(state)

  return activeDatasetQuery === query
    ? setIn(['visibleDatasetQueries', id], query)(state)
    : state
}

const visibleDatasetQueryReducer = reduceFor(DATASET_LOAD_SUCCESS)(
  reduceVisibleDatasetQuery
)

export const datasetLoadSuccessReducer = composeReducers(
  datasetQueriesReducer,
  datasetEntriesReducer,
  datasetLoadingStateSuccessReducer,
  visibleDatasetQueryReducer,
  reduceIn('visibleDatasetQueries')((state = {}) => state)
)
