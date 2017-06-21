//@flow

import { get } from '../helpers/getset'
import type { State } from '../store/stateShape'
import type { Action, ActionCreator } from './actionTypes'
import { dataQueryLoadingStateConnectorFor } from '../connectors/datasetsLoadingStateConnectors'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'
import { activeDatasetGetQueryConnector } from '../connectors/activeDatasetQueryConnector'
import { getDatasetPromise } from '../api/getDatasetPromise'
import { configGetConnector } from '../connectors/configConnectors'
import {
  datasetLoadSuccess,
  datasetLoadError,
} from './dataGetterActionCreators'

const shouldFetch = loadingState =>
  !get('loaded')(loadingState) && !get('loading')(loadingState)

export const dataGetterActionEnhancer = (actionCreator: ActionCreator) => (
  action: Action
) => (dispatch: Action => mixed, getState: () => State) => {
  const previousState = getState()

  dispatch({ ...actionCreator(action), reselectDataset: true })

  const nextState = getState()

  const id = activeDatasetGetIdConnector(nextState)
  const query = activeDatasetGetQueryConnector(nextState)
  const periodType = configGetConnector('periodType')(nextState)

  if (!id) {
    return
  }

  // get loading state before loading state was updated
  const loadingState = dataQueryLoadingStateConnectorFor({ id, query })(
    previousState
  )

  if (!shouldFetch(loadingState)) {
    return
  }

  getDatasetPromise({ id, query, periodType }).then(
    dataEntries =>
      dispatch(datasetLoadSuccess({ id, query, periodType, dataEntries })),
    error => dispatch(datasetLoadError({ id, query, error }))
  )
}
