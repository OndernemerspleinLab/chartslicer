import { composeReducers } from './reducerHelpers'
import { metadataLoadingStateReducer } from './metadataLoadingStateReducer'
import { activeDatasetReducer } from './activeDatasetReducer'
import { configReducer } from './configReducer'
import { metadataReducer } from './metadataReducer'
import { datasetReselectingReducer } from './datasetReselectingReducer'
import { datasetLoadErrorReducer } from './datasetLoadErrorReducer'
import { datasetLoadSuccessReducer } from './datasetLoadSuccessReducer'

export const reducers = composeReducers(
  datasetReselectingReducer,
  datasetLoadSuccessReducer,
  datasetLoadErrorReducer,
  metadataReducer,
  metadataLoadingStateReducer,
  activeDatasetReducer,
  configReducer
)
