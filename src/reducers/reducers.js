import { composeReducers } from './reducerHelpers'
import { metadataLoadingStateReducer } from './metadataLoadingStateReducer'
import { activeDatasetReducer } from './activeDatasetReducer'
import { configReducer } from './configReducer'
import { metadataReducer } from './metadataReducer'
import { datasetReselectingReducer } from './datasetReselectingReducer'
import { datasetLoadErrorReducer } from './datasetLoadErrorReducer'
import { datasetLoadSuccessReducer } from './datasetLoadSuccessReducer'
import { multiDimensionChangeVisibleDatasetReducer } from '../connectors/visibleDatasetQueryConnector'
import { accordionReducer } from './accordionReducer'

export const reducers = composeReducers(
	multiDimensionChangeVisibleDatasetReducer,
	datasetReselectingReducer,
	accordionReducer,
	datasetLoadSuccessReducer,
	datasetLoadErrorReducer,
	metadataReducer,
	metadataLoadingStateReducer,
	activeDatasetReducer,
	configReducer,
)
