//@flow

import type { State } from '../store/stateShape'
import { reduceWhen, composeReducers } from './reducerHelpers'
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
  updateIn(
    ['datasetLoadingState', state.activeDatasetId, queryString],
    (loadingState = {}) => {
      if (loadingState.loaded) {
        return loadingState
      } else {
        return {
          error: undefined,
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

export const datasetsReducer = reduceWhenReselectingDataset(
  (state: State): State => {
    const queryString = getDatasetQueryString(getConfigWithDate(state))

    return composeReducers(
      setActiveDatasetQuery,
      setDatasetQueryLoading
    )(state, { queryString })
  }
)
