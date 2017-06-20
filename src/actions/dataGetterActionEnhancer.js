//@flow

import { fetchFilteredDataset } from '../api/apiCalls'
import type { State } from '../store/stateShape'
import type { Action, ActionCreator } from './actionTypes'

export const dataGetterActionEnhancer = (actionCreator: ActionCreator) => (
  action: Action
) => (dispatch: Action => mixed, getState: () => State) => {
  dispatch({ ...actionCreator(action), reselectDataset: true })

  const state = getState()

  // const configWithDate = getConfigWithDate(state)

  // fetchFilteredDataset(configWithDate)
}
