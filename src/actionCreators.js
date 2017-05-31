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
  INVALID_DATASET_ID_SELECTED,
  CONFIG_CHANGED,
} from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { fetchJson, fetchText } from './fetch'
import { get, getIn, merge, set } from './getset'
import { shouldFetchForId } from './reducers/networkStateReducer'
import { getCbsPeriodType } from './cbsPeriod'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}
const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const configChanged = createSimpleAction(
  CONFIG_CHANGED,
  'id',
  'name',
  'value'
)

export const datasetIdSelected = createSimpleAction(
  DATASET_ID_SELECTED,
  'id',
  'loaded'
)

export const invalidDatasetIdSelected = createSimpleAction(
  INVALID_DATASET_ID_SELECTED,
  'input'
)

export const datasetLoadSuccess = createSimpleAction(
  DATASET_LOAD_SUCCESS,
  'id',
  'url',
  'dataProperties',
  'tableInfo',
  'data'
)

export const datasetLoadError = createSimpleAction(
  DATASET_LOAD_ERROR,
  'id',
  'error'
)

const groupByPeriodType = groupBy(({ Perioden }) => getCbsPeriodType(Perioden))

const fetchTableInfo = id =>
  fetchJson(getTableInfoUrl(id)).then(getIn(['value', 0]))

const fetchDataProperties = id =>
  fetchJson(getDataPropertiesUrl(id))
    .then(get('value'))
    .then(groupBy(({ Type }) => Type))

const fetchDataset = id =>
  fetchText(getDatasetCountUrl(id))
    .then(Number)
    .then(datasetSize => fetchJson(getFilteredDatasetUrl({ id, datasetSize })))
    .then(get('value'))
    .then(groupByPeriodType)

const allPromises = (...promises) => {
  promises.forEach(promise => promise.catch(() => {}))
  return Promise.all(promises)
}

const fetchTableData = ({ id }) =>
  allPromises(
    fetchTableInfo(id),
    fetchDataProperties(id),
    fetchDataset(id)
  ).then(([tableInfo, dataProperties, data]) => ({
    tableInfo,
    dataProperties,
    data,
  }))
export const tableSelectionChanged = ({
  input,
  datasetsNetworkState,
}) => dispatch => {
  const maybeExtracted = cbsIdExtractor(input)

  if (!maybeExtracted) {
    dispatch(invalidDatasetIdSelected({ input }))
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
      return dispatch(datasetLoadError(merge({ error })(maybeExtracted)))
    })
}
