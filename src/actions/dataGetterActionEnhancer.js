//@flow

import { get } from '../helpers/getset'
import { fetchFilteredDataset } from '../api/apiCalls'
import type { State } from '../store/stateShape'
import type { Action, ActionCreator } from './actionTypes'
import { datasetLoadingStateConnectorFor } from '../connectors/datasetsLoadingStateConnectors'
import { activeDatasetIdConnector } from '../connectors/activeDatasetIdConnector'
import { activeDatasetQueryConnector } from '../connectors/activeDatasetQueryConnector'

const shouldFetch = !get('loaded')

export const dataGetterActionEnhancer = (actionCreator: ActionCreator) => (
  action: Action
) => (dispatch: Action => mixed, getState: () => State) => {
  const previousState = getState()

  dispatch({ ...actionCreator(action), reselectDataset: true })

  const nextState = getState()

  const id = activeDatasetIdConnector(nextState)
  const query = activeDatasetQueryConnector(nextState)

  // get loading state before changes were made for id and query in state after changes
  const loadingState = datasetLoadingStateConnectorFor({ id, query })(
    previousState
  )

  if (!shouldFetch(loadingState)) {
    return
  }

  fetchFilteredDataset({ id, query }).then(
    data => dispatch(datasetLoadSuccess({ id, query, data })),
    error => dispatch(datasetLoadError({ id, query, error }))
  )
}
