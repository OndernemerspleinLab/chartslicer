import {
	DATASET_ID_SELECTED,
	METADATA_LOAD_SUCCESS,
	METADATA_LOAD_ERROR,
	INVALID_DATASET_ID_SELECTED,
} from '../actions/actions'
import {
	reduceFor,
	reduceIn,
	defaultState,
	reduceWhen,
	composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import {
	loadingReducer,
	loadSuccessReducer,
	loadErrorReducer,
	invalidIdReducer,
} from './loadingStateHelpers'

const metadataLoadingStateSelector = compose(
	reduceIn('metadataLoadingState'),
	defaultState({}),
)

const reduceLoading = compose(
	metadataLoadingStateSelector,
	reduceFor(DATASET_ID_SELECTED),
	reduceWhen((state, { loaded }) => !loaded),
)(loadingReducer)

const reduceLoadSuccess = compose(
	metadataLoadingStateSelector,
	reduceFor(METADATA_LOAD_SUCCESS),
)(loadSuccessReducer)

const reduceLoadError = compose(
	metadataLoadingStateSelector,
	reduceFor(METADATA_LOAD_ERROR),
)(loadErrorReducer)

const reduceInvalidId = compose(
	metadataLoadingStateSelector,
	reduceFor(INVALID_DATASET_ID_SELECTED),
)(invalidIdReducer)

export const metadataLoadingStateReducer = composeReducers(
	reduceLoading,
	reduceLoadSuccess,
	reduceLoadError,
	reduceInvalidId,
)
