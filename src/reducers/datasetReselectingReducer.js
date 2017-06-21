//@flow

import type { State } from '../store/stateShape'
import { reduceWhen, composeReducers, reduceIn } from './reducerHelpers'
import type { Reducer } from './reducerHelpers'
import type { Action } from '../actions/actionTypes'
import { setIn, updateIn } from '../helpers/getset'
import { metadataIsLoadedConnector } from '../connectors/metadataLoadingStateConnectors'
import { getDatasetQueryString } from '../api/apiCalls'
import { configConnector } from '../connectors/configConnectors'
import type { ConfigWithDate } from '../api/apiCalls'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'

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
  const activeDatasetId = activeDatasetGetIdConnector(state)
  return updateIn(
    ['dataQueryLoadingState', activeDatasetId, queryString],
    (loadingState = {}) => {
      if (loadingState.loaded) {
        return loadingState
      } else {
        return {
          error: null,
          loading: true,
          loaded: false,
          query: queryString,
          id: activeDatasetId,
        }
      }
    }
  )(state)
}

const setActiveDatasetQuery = (state, { queryString, id }) =>
  setIn(['activeDatasetQueries', id], queryString)(state)

const reduceDatasetReselecting = (state: State): State => {
  const queryString = getDatasetQueryString(getConfigWithDate(state))
  const id = activeDatasetGetIdConnector(state)

  return composeReducers(setActiveDatasetQuery, setDatasetQueryLoading)(state, {
    queryString,
    id,
  })
}

export const datasetReselectingReducer: Reducer = composeReducers(
  reduceWhenReselectingDataset(reduceDatasetReselecting),
  reduceIn('dataQueryLoadingState')((state = {}) => state),
  reduceIn('activeDatasetQueries')((state = {}) => state)
)
