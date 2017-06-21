//@flow

import type { State } from '../store/stateShape'
import { reduceWhen, composeReducers, reduceIn } from './reducerHelpers'
import type { Reducer } from './reducerHelpers'
import type { Action } from '../actions/actionTypes'
import { set, updateIn } from '../helpers/getset'
import { metadataIsLoadedConnector } from '../connectors/metadataLoadingStateConnectors'
import { getDatasetQueryString } from '../api/apiCalls'
import { configConnector } from '../connectors/configConnectors'
import type { ConfigWithDate } from '../api/apiCalls'

const getConfigWithDate = (state: State): ConfigWithDate => {
  const config = configConnector(state)
  const { now } = state

  return { ...config, now }
}

const reduceWhenReselectingDataset = reduceWhen(
  (state: State, { reselectDataset }: Action) =>
    reselectDataset && metadataIsLoadedConnector(state)
)

const setDatasetQueryLoading = (state: State, { queryString }) => {
  return updateIn(
    ['datasetLoadingState', state.activeDatasetId, queryString],
    (loadingState = {}) => {
      if (loadingState.loaded) {
        return loadingState
      } else {
        return {
          error: null,
          loading: true,
          loaded: false,
          query: queryString,
        }
      }
    }
  )(state)
}

const setActiveDatasetQuery = (state, { queryString }) =>
  set('activeDatasetQuery', queryString)(state)

const reduceDatasetReselecting = (state: State): State => {
  const queryString = getDatasetQueryString(getConfigWithDate(state))

  return composeReducers(setActiveDatasetQuery, setDatasetQueryLoading)(state, {
    queryString,
  })
}

export const datasetReselectingReducer: Reducer = composeReducers(
  reduceWhenReselectingDataset(reduceDatasetReselecting),
  reduceIn('datasetLoadingState')((state = {}) => state),
  reduceIn('activeDatasetQuery')((state = null) => state)
)
