import { addReducer } from '../store'
import { TABLE_ID_SELECTING, TABLE_ID_SELECTED } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { update, merge } from '../getset'
import { assignLoading, assignLoadSuccess } from './networkStateReducer'

const tableIdReducer = (state = {}, { id }) => update(id, merge({ id }))(state)

const tableInfoReducerSelector = compose(
  reduceIn('tableInfo'),
  defaultState({})
)

const selectingReducer = compose(
  tableInfoReducerSelector,
  reduceFor(TABLE_ID_SELECTING)
)(tableIdReducer)

const tableInfoReducer = (state = {}, { id, url, dataProperties, tableInfo }) =>
  update(id, merge({ url, dataProperties, tableInfo }))(state)

const selectedReducer = compose(
  tableInfoReducerSelector,
  reduceFor(TABLE_ID_SELECTED)
)(tableInfoReducer)

addReducer(selectedReducer)
addReducer(selectingReducer)
