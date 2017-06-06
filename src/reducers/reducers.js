import { composeReducers } from './reducerHelpers'
import {
  reduceLoading,
  reduceLoadSuccess,
  reduceLoadError,
  reduceInvalidId,
} from './networkStateReducer'
import { activeDatasetReducer } from './activeDatasetReducer'
import { reduceDatasets } from './datasetsReducer'
import { configReducer } from './configReducer'

export const reducers = composeReducers(
  reduceLoading,
  reduceLoadSuccess,
  reduceLoadError,
  reduceInvalidId,
  activeDatasetReducer,
  reduceDatasets,
  configReducer
)
