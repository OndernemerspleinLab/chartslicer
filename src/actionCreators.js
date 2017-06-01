import {
  getTableInfoUrl,
  getDataPropertiesUrl,
  getDatasetCountUrl,
  getFilteredDatasetUrl,
  getDimensionGroupsUrl,
  getDimensionUrl,
} from './config'
import { groupBy, zipObject } from 'lodash/fp'
import {
  DATASET_ID_SELECTED,
  DATASET_LOAD_SUCCESS,
  DATASET_LOAD_ERROR,
  INVALID_DATASET_ID_SELECTED,
  CONFIG_CHANGED,
} from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { fetchJson, fetchText } from './fetch'
import { get, getIn, merge, set, update } from './getset'
import { shouldFetchForId } from './reducers/networkStateReducer'
import { getCbsPeriodType } from './cbsPeriod'

const allPromises = (...promises) => Promise.all(promises)

const getFirstValue = getIn(['value', 0])

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
  'dimensions',
  'dimensionGroups',
  'tableInfo',
  'data'
)

export const datasetLoadError = createSimpleAction(
  DATASET_LOAD_ERROR,
  'id',
  'error'
)

const groupByPeriodType = groupBy(({ Perioden }) => getCbsPeriodType(Perioden))

const groupByParentID = groupBy(({ ParentID }) => ParentID || 'root')

const fetchTableInfo = id => fetchJson(getTableInfoUrl(id)).then(getFirstValue)

const fetchDataProperties = id =>
  fetchJson(getDataPropertiesUrl(id))
    .then(get('value'))
    .then(groupBy(({ Type }) => Type))
    .then(update('Topic', groupByParentID))
    .then(update('TopicGroup', groupByParentID))

const fetchDimension = id => dimensionKey =>
  fetchJson(getDimensionUrl({ id, dimensionKey })).then(get('value'))

const fetchDimensions = ({ id, dimensionKeys = [] }) => {
  return allPromises(
    ...dimensionKeys.map(fetchDimension(id))
  ).then(dimensionValues => {
    return zipObject(dimensionKeys, dimensionValues)
  })
}

const fetchDimensionGroups = id =>
  fetchJson(getDimensionGroupsUrl(id)).then(getFirstValue)

const fetchDimensionInfo = id => ({ Dimension = [], GeoDimension = [] }) =>
  allPromises(
    fetchDimensions({
      id,
      dimensionKeys: [...Dimension, ...GeoDimension].map(({ Key }) => Key),
    }),
    fetchDimensionGroups(id)
  )

const fetchDataProperstiesAndDimensionInfo = id =>
  fetchDataProperties(id).then(dataProperties => {
    return fetchDimensionInfo(id)(
      dataProperties
    ).then(([dimensions, dimensionGroups]) => ({
      dataProperties,
      dimensions,
      dimensionGroups,
    }))
  })

const fetchDataset = id =>
  fetchText(getDatasetCountUrl(id))
    .then(Number)
    .then(datasetSize => fetchJson(getFilteredDatasetUrl({ id, datasetSize })))
    .then(get('value'))
    .then(groupByPeriodType)

const fetchTableData = ({ id }) =>
  allPromises(
    fetchTableInfo(id),
    fetchDataProperstiesAndDimensionInfo(id),
    fetchDataset(id)
  ).then(
    ([tableInfo, { dataProperties, dimensions, dimensionGroups }, data]) => ({
      tableInfo,
      dataProperties,
      data,
      dimensions,
      dimensionGroups,
    })
  )
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
