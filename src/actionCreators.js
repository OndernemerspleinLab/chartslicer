import { getTableInfoUrl, getDataPropertiesUrl } from './config'
import { groupBy } from 'lodash/fp'
import {
  TABLE_ID_SELECTING,
  TABLE_ID_SELECTED,
  TABLE_ID_SELECTING_FAILED,
} from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { fetchJson } from './fetchLatest'
import { get, assign } from 'lodash/fp'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}
const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const tableIdSelecting = createSimpleAction(TABLE_ID_SELECTING, 'id')

export const tableIdSelected = createSimpleAction(
  TABLE_ID_SELECTED,
  'id',
  'url',
  'dataProperties',
  'tableInfo'
)

export const tableIdSelectingFailed = createSimpleAction(
  TABLE_ID_SELECTING_FAILED,
  'id',
  'error'
)

const fetchTableInfo = id =>
  fetchJson(getTableInfoUrl(id)).then(get(['value', 0]))

const fetchDataProperties = id =>
  fetchJson(getDataPropertiesUrl(id))
    .then(get('value'))
    .then(groupBy(({ Type }) => Type))

const fetchTableData = ({ id }) =>
  Promise.all([
    fetchTableInfo(id),
    fetchDataProperties(id),
  ]).then(([tableInfo, dataProperties]) => ({ tableInfo, dataProperties }))
export const tableSelectionChanged = input => dispatch => {
  const maybeExtracted = cbsIdExtractor(input)

  if (!maybeExtracted) {
    return
  }
  dispatch(tableIdSelecting(maybeExtracted))
  fetchTableData(maybeExtracted)
    .then(data => dispatch(tableIdSelected(assign(maybeExtracted)(data))))
    .catch(error =>
      dispatch(tableIdSelectingFailed(assign(maybeExtracted)({ error })))
    )
}
