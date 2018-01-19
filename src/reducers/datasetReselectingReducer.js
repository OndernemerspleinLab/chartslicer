// @flow

import type { State } from '../store/stateShape'
import { reduceWhen, composeReducers, reduceIn } from './reducerHelpers'
import type { Reducer } from './reducerHelpers'
import type { Action } from '../actions/actionTypes'
import { setIn, updateIn, getIn } from '../helpers/getset'
import { metadataIsLoadedConnector } from '../connectors/metadataLoadingStateConnectors'
import { getDatasetQueryString } from '../api/apiCalls'
import { configConnector } from '../connectors/configConnectors'
import type { ConfigWithDate } from '../api/apiCalls'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'
import { tableLanguageGetter } from '../connectors/tableInfoConnectors'

const getConfigWithDateAndLanguage = (state: State): ConfigWithDate => {
	const config = configConnector(state)
	const { now } = state
	const language = tableLanguageGetter(state)

	return { ...config, now, language }
}

const reduceWhenReselectingDataset = reduceWhen(
	(state: State, { reselectDataset }: Action) =>
		reselectDataset && metadataIsLoadedConnector(state),
)

const setDatasetQueryLoading = (state: State, { queryString, id }) => {
	return updateIn(
		['dataQueryLoadingState', id, queryString],
		(loadingState = {}) => {
			if (loadingState.loaded) {
				return loadingState
			} else {
				return {
					error: null,
					loading: true,
					loaded: false,
					query: queryString,
					id,
				}
			}
		},
	)(state)
}

const setActiveDatasetQueries = (state, { queryString, id }) =>
	setIn(['activeDatasetQueries', id], queryString)(state)

const setVisibleDatasetQueries = (state, { queryString, id }) =>
	getIn(['dataQueryLoadingState', id, queryString, 'loaded'])(state)
		? setIn(['visibleDatasetQueries', id], queryString)(state)
		: state

const reduceDatasetReselecting = (state: State, { type }): State => {
	const queryString = getDatasetQueryString(getConfigWithDateAndLanguage(state))
	const id = activeDatasetGetIdConnector(state)

	return composeReducers(
		setActiveDatasetQueries,
		setDatasetQueryLoading,
		setVisibleDatasetQueries,
	)(state, {
		queryString,
		id,
	})
}

export const datasetReselectingReducer: Reducer = composeReducers(
	reduceWhenReselectingDataset(reduceDatasetReselecting),
	reduceIn('dataQueryLoadingState')((state = {}) => state),
	reduceIn('visibleDatasetQueries')((state = {}) => state),
)
