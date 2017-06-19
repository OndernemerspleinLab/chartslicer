import {
  DATASET_ID_SELECTED,
  DATASET_ID_CLEARED,
  METADATA_LOAD_SUCCESS,
  METADATA_LOAD_ERROR,
  INVALID_DATASET_ID_SELECTED,
  CONFIG_CHANGED,
  DATA_LOAD_SUCCESS,
  DATA_LOAD_ERROR,
} from './actions'

export { datasetSelectionChanged } from './datasetSelectionChangedActionCreator'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}

const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const configChanged = createSimpleAction(
  CONFIG_CHANGED,
  'activeDatasetId',
  'keyPath',
  'value',
  'replaceValue',
  'multiValue'
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

export const metadataLoadSuccess = createSimpleAction(
  METADATA_LOAD_SUCCESS,
  'id',
  'tableInfo',
  'topicGroups',
  'topics',
  'dimensions',
  'categoryGroups',
  'categories'
)

export const metadataLoadError = createSimpleAction(
  METADATA_LOAD_ERROR,
  'id',
  'error'
)

export const dataLoadSuccess = createSimpleAction(DATA_LOAD_SUCCESS, 'query')

export const dataLoadError = createSimpleAction(
  DATA_LOAD_ERROR,
  'query',
  'error'
)
