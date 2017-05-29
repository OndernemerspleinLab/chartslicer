import {
  getTableInfoUrl,
  getDataPropertiesUrl,
  getDatasetCountUrl,
  getFilteredDatasetUrl,
} from './config'
import { groupBy } from 'lodash/fp'
import {
  TABLE_ID_SELECTING,
  TABLE_ID_SELECTED,
  TABLE_ID_SELECTING_FAILED,
} from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { fetchJson, fetchText } from './fetch'
import { get, getIn, merge } from './getset'

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
  'tableInfo',
  'dataset'
)

export const tableIdSelectingFailed = createSimpleAction(
  TABLE_ID_SELECTING_FAILED,
  'id',
  'error'
)

const fetchTableInfo = id =>
  fetchJson(getTableInfoUrl(id)).then(getIn(['value', 0]))

const fetchDataProperties = id =>
  fetchJson(getDataPropertiesUrl(id))
    .then(get('value'))
    .then(groupBy(({ Type }) => Type))

const fetchDataset = id =>
  fetchText(getDatasetCountUrl(id))
    .then(Number)
    .then(r => (window.r = r))
    .then(datasetSize => fetchJson(getFilteredDatasetUrl({ id, datasetSize })))
    .then(get('value'))

const fetchTableData = ({ id }) =>
  Promise.all([
    fetchTableInfo(id),
    fetchDataProperties(id),
    fetchDataset(id),
  ]).then(([tableInfo, dataProperties, dataset]) => ({
    tableInfo,
    dataProperties,
    dataset,
  }))
export const tableSelectionChanged = input => dispatch => {
  const maybeExtracted = cbsIdExtractor(input)

  if (!maybeExtracted) {
    return
  }
  dispatch(tableIdSelecting(maybeExtracted))
  fetchTableData(maybeExtracted)
    .then(data => dispatch(tableIdSelected(merge(data)(maybeExtracted))))
    .catch(error =>
      dispatch(tableIdSelectingFailed(merge({ error })(maybeExtracted)))
    )
}
