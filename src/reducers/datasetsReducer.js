import { DATASET_LOAD_SUCCESS } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { update, merge } from '../getset'

const datasetsReducerSelector = compose(reduceIn('datasets'), defaultState({}))

const datasetsReducer = (
  state = {},
  { id, url, dataProperties, tableInfo, dataset }
) => update(id, merge({ url, dataProperties, tableInfo, dataset }))(state)

export const reduceDatasets = compose(
  datasetsReducerSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(datasetsReducer)
