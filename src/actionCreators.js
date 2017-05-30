import {
  getTableInfoUrl,
  getDataPropertiesUrl,
  getDatasetCountUrl,
  getFilteredDatasetUrl,
} from './config'
import { groupBy } from 'lodash/fp'
import {
  DATASET_ID_SELECTED,
  DATASET_LOAD_SUCCESS,
  DATASET_LOAD_ERROR,
} from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { fetchJson, fetchText } from './fetch'
import { get, getIn, merge, set } from './getset'
import { shouldFetchForId } from './reducers/networkStateReducer'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}
const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const datasetIdSelected = createSimpleAction(
  DATASET_ID_SELECTED,
  'id',
  'loaded'
)

export const datasetLoadSuccess = createSimpleAction(
  DATASET_LOAD_SUCCESS,
  'id',
  'url',
  'dataProperties',
  'tableInfo',
  'dataset'
)

export const datasetLoadError = createSimpleAction(
  DATASET_LOAD_ERROR,
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
export const tableSelectionChanged = ({
  input,
  datasetsNetworkState,
}) => dispatch => {
  const maybeExtracted = cbsIdExtractor(input)

  if (!maybeExtracted) {
    return
  }

  if (!shouldFetchForId(maybeExtracted)(datasetsNetworkState)) {
    dispatch(datasetIdSelected(set('loaded', true)(maybeExtracted)))
    return
  }

  dispatch(datasetIdSelected(maybeExtracted))

  fetchTableData(maybeExtracted)
    .then(data => dispatch(datasetLoadSuccess(merge(data)(maybeExtracted))))
    .catch(error => {
      console.log('E', error)
      return dispatch(datasetLoadError(merge({ error })(maybeExtracted)))
    })
}
