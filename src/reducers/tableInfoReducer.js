import { addReducer } from '../store'
import { TABLE_ID_SELECTING, TABLE_ID_SELECTED } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { update } from 'lodash/fp'
import { assignLoading, assignLoadSuccess } from './networkStateReducer'
import { assign } from '../helpers'

const tableIdReducer = (state = {}, { id }) => update(id, assign({ id }))(state)

const tableInfoReducerSelector = compose(
  reduceIn('tableInfo'),
  defaultState({})
)

const selectingReducer = compose(
  tableInfoReducerSelector,
  reduceFor(TABLE_ID_SELECTING)
)(tableIdReducer)

const tableInfoReducer = (state = {}, { id, url, dataProperties, tableInfo }) =>
  update(id, assign({ url, dataProperties, tableInfo }))(state)

const selectedReducer = compose(
  tableInfoReducerSelector,
  reduceFor(TABLE_ID_SELECTED)
)(tableInfoReducer)

addReducer(selectedReducer)
addReducer(selectingReducer)
