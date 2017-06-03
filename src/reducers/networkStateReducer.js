import {
  DATASET_ID_SELECTED,
  DATASET_LOAD_SUCCESS,
  DATASET_LOAD_ERROR,
  INVALID_DATASET_ID_SELECTED,
} from '../actions'
import { pick } from 'lodash/fp'
import { reduceFor, reduceIn, defaultState, reduceWhen } from './reducerHelpers'
import { compose } from 'redux'
import { update, merge, get } from '../getset'
import { connect } from 'react-redux'
import { existing } from '../helpers'

export const invalidIdError = new Error('Invalid dataset ID')

export const getInvalidIdState = () => ({
  loading: false,
  error: invalidIdError,
  loaded: false,
})
export const getLoadingState = () => ({
  loading: true,
  error: null,
  loaded: false,
})
export const getLoadSuccessState = () => ({
  loading: false,
  error: null,
  loaded: true,
})
export const getLoadErrorState = (error = true) => ({
  loading: false,
  error,
  loaded: false,
})

const datasetsNetworkStateReducerSelector = compose(
  reduceIn('datasetsNetworkState'),
  defaultState({})
)

const loadingReducer = (state = {}, { id }) =>
  update(id, merge({ id }, getLoadingState()))(state)

export const loadSuccessReducer = (state = {}, { id }) =>
  update(id, merge({ id }, getLoadSuccessState()))(state)

export const loadErrorReducer = (state = {}, { id, error }) =>
  update(id, merge({ id }, getLoadErrorState(error)))(state)

export const invalidIdReducer = (state = {}, { input }) =>
  update(input, merge({ id: input }, getInvalidIdState()))(state)

export const reduceLoading = compose(
  datasetsNetworkStateReducerSelector,
  reduceFor(DATASET_ID_SELECTED),
  reduceWhen((state, { loaded }) => !loaded)
)(loadingReducer)

export const reduceLoadSuccess = compose(
  datasetsNetworkStateReducerSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(loadSuccessReducer)

export const reduceLoadError = compose(
  datasetsNetworkStateReducerSelector,
  reduceFor(DATASET_LOAD_ERROR)
)(loadErrorReducer)

export const reduceInvalidId = compose(
  datasetsNetworkStateReducerSelector,
  reduceFor(INVALID_DATASET_ID_SELECTED)
)(invalidIdReducer)

export const connectDatasetsNetworkState = connect(
  ({ datasetsNetworkState }) => ({
    datasetsNetworkState,
  })
)

export const connectActiveDatasetsNetworkState = (...propNames) =>
  connect(({ datasetsNetworkState, activeDatasetId }) =>
    pick(propNames)(get(activeDatasetId)(datasetsNetworkState))
  )

const shouldFetch = itemNetworkState =>
  get('error')(itemNetworkState) ||
  (!get('loading')(itemNetworkState) && !get('loaded')(itemNetworkState))

export const shouldFetchForId = ({ id }) => networkState =>
  existing(id) && shouldFetch(get(id)(networkState))
