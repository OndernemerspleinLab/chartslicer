import { composeReducers } from './reducerHelpers'
import { metadataLoadingStateReducer } from './metadataLoadingStateReducer'
import { activeDatasetReducer } from './activeDatasetReducer'
import { configReducer } from './configReducer'
import { metadataReducer } from './metadataReducer'

export const reducers = composeReducers(
  metadataReducer,
  metadataLoadingStateReducer,
  activeDatasetReducer,
  configReducer
)
