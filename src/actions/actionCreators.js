import {
  DATASET_ID_SELECTED,
  DATASET_ID_CLEARED,
  DATASET_LOAD_SUCCESS,
  DATASET_LOAD_ERROR,
  INVALID_DATASET_ID_SELECTED,
  CONFIG_CHANGED,
} from './actions'
import { cbsIdExtractor } from '../cbsIdExtractor'
import { merge, set } from '../getset'
import { shouldFetchForId } from '../reducers/networkStateReducer'
import { getMetadataPromise } from '../api/getMetadataPromise'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}

const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const configChanged = createSimpleAction(
  CONFIG_CHANGED,
  'id',
  'name',
  'value'
)

export const datasetIdCleared = createSimpleAction(DATASET_ID_CLEARED)

export const datasetIdSelected = createSimpleAction(
  DATASET_ID_SELECTED,
  'id',
  'loaded'
)

export const invalidDatasetIdSelected = createSimpleAction(
  INVALID_DATASET_ID_SELECTED,
  'input'
)

export const datasetLoadSuccess = createSimpleAction(
  DATASET_LOAD_SUCCESS,
  'id',
  'dataProperties',
  'dimensions',
  'dimensionGroups',
  'tableInfo',
  'topicGroups',
  'topics',
  'categoryGroups',
  'categories'
)

export const datasetLoadError = createSimpleAction(
  DATASET_LOAD_ERROR,
  'id',
  'error'
)

export const tableSelectionChanged = ({
  input,
  datasetsNetworkState,
}) => dispatch => {
  if (!input) {
    dispatch(datasetIdCleared())
    return
  }

  const maybeId = cbsIdExtractor(input)

  if (!maybeId) {
    dispatch(invalidDatasetIdSelected({ input }))
    return
  }

  if (!shouldFetchForId(maybeId)(datasetsNetworkState)) {
    dispatch(datasetIdSelected({ loaded: true, id: maybeId }))
    return
  }

  dispatch(datasetIdSelected({ id: maybeId }))

  getMetadataPromise(maybeId).then(data => dispatch(datasetLoadSuccess(data)))
}
