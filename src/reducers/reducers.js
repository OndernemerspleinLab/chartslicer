import { composeReducers } from './reducerHelpers'
import { metadataLoadingStateReducer } from './metadataLoadingStateReducer'
import { activeDatasetReducer } from './activeDatasetReducer'
import { configReducer } from './configReducer'
import { metadataReducer } from './metadataReducer'
import { datasetReselectingReducer } from './datasetReselectingReducer'

export const reducers = composeReducers(
  datasetReselectingReducer,
  metadataReducer,
  metadataLoadingStateReducer,
  activeDatasetReducer,
  configReducer
)
