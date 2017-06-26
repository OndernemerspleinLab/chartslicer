import { createSimpleAction } from './actionHelpers'
import { DATASET_LOAD_SUCCESS, DATASET_LOAD_ERROR } from './actions'

export const datasetLoadSuccess = createSimpleAction(
  DATASET_LOAD_SUCCESS,
  'id',
  'query',
  'config',
  'dataEntries'
)

export const datasetLoadError = createSimpleAction(
  DATASET_LOAD_ERROR,
  'id',
  'query',
  'error'
)
