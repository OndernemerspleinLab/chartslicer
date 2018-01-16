import {
  DATASET_ID_SELECTED,
  DATASET_ID_CLEARED,
  METADATA_LOAD_SUCCESS,
  METADATA_LOAD_ERROR,
  INVALID_DATASET_ID_SELECTED,
  CONFIG_CHANGED,
  MULTI_DIMENSION_CHANGED,
  LABEL_ALIAS_CHANGED,
  ACCORDION_OPENED,
  ACCORDION_CLOSED,
  ACCORDION_ALL_OPENED,
  ACCORDION_ALL_CLOSED,
} from './actions'
import { createSimpleAction } from './actionHelpers'
import { dataGetterActionEnhancer } from './dataGetterActionEnhancer'

export const configChanged = dataGetterActionEnhancer(
  createSimpleAction(
    CONFIG_CHANGED,
    'activeDatasetId',
    'keyPath',
    'value',
    'replaceValue',
    'multiValue',
    'maxLength'
  )
)
export const multiDimensionChanged = dataGetterActionEnhancer(
  createSimpleAction(
    MULTI_DIMENSION_CHANGED,
    'activeDatasetId',
    'multiDimension'
  )
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

export const metadataLoadSuccess = dataGetterActionEnhancer(
  createSimpleAction(
    METADATA_LOAD_SUCCESS,
    'id',
    'tableInfo',
    'topicGroups',
    'topics',
    'dimensions',
    'categoryGroups',
    'categories'
  )
)

export const metadataLoadError = createSimpleAction(
  METADATA_LOAD_ERROR,
  'id',
  'error'
)

export const labelAliasChanged = createSimpleAction(
  LABEL_ALIAS_CHANGED,
  'activeDatasetId',
  'aliasType',
  'dimensionKey',
  'id',
  'value'
)

export const accordionOpened = createSimpleAction(
  ACCORDION_OPENED,
  'activeDatasetId',
  'dimensionKey',
  'id'
)

export const accordionClosed = createSimpleAction(
  ACCORDION_CLOSED,
  'activeDatasetId',
  'dimensionKey',
  'id'
)
export const accordionAllOpened = createSimpleAction(
  ACCORDION_ALL_OPENED,
  'activeDatasetId',
  'dimensionKey'
)

export const accordionAllClosed = createSimpleAction(
  ACCORDION_ALL_CLOSED,
  'activeDatasetId',
  'dimensionKey'
)
