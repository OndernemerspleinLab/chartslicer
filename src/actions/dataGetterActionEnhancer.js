//@flow

import { get } from '../helpers/getset'
import type { State } from '../store/stateShape'
import type { Action, ActionCreator } from './actionTypes'
import { dataQueryLoadingStateConnectorFor } from '../connectors/datasetsLoadingStateConnectors'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'
import { activeDatasetGetQueryConnector } from '../connectors/activeDatasetQueryConnector'
import { getDatasetPromise } from '../api/getDatasetPromise'
import { configConnector } from '../connectors/configConnectors'
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
  const config = configConnector(nextState)
  const periodType = get('periodType')(config)
  const categoryKeys = get('categoryKeys')(config)
  const topicKeys = get('topicKeys')(config)
  const multiDimension = get('multiDimension')(config)

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

  getDatasetPromise({
    id,
    query,
    periodType,
    topicKeys,
    multiDimension,
    categoryKeys,
  }).then(
    dataEntries =>
      dispatch(datasetLoadSuccess({ id, query, config, dataEntries })),
    error => dispatch(datasetLoadError({ id, query, error }))
  )
}
