import { bracketize } from './../helpers/helpers'
// @flow

import { map, join } from 'lodash/fp'
import { compose } from 'recompose'
import { fetchJson } from './fetch'
import { get, getIn } from '../helpers/getset'
import type {
  DatasetId,
  DimensionKey,
  TopicKey,
  CategoryKey,
} from '../store/stateShape'
import type {
  CbsDataPropertiesPromise,
  CbsTableInfoPromise,
  CbsCategoryGroupsPromise,
  CbsCategoriesPromise,
  CbsPeriodsPromise,
} from '../api/apiShape'

const getOnlyValue = responseBody => getIn(['value', 0])(responseBody) || {}
const getValues = responseBody => get('value')(responseBody) || []

const select = (keys: string[]) => `$select=${keys.join(',')}`

export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

///////// TableInfo /////////

const tableInfoSelection = ['Title', 'GraphTypes']

const getTableInfoUrl = (id: DatasetId) =>
  `${feedBaseUrl}/${id}/TableInfos?${select(tableInfoSelection)}`
export const fetchTableInfo = (id: DatasetId): CbsTableInfoPromise =>
  fetchJson(getTableInfoUrl(id)).then(getOnlyValue)

///////// Periods /////////

const periodsSelection = ['Key']

const getPeriodsUrl = (id: DatasetId) =>
  `${feedBaseUrl}/${id}/Perioden?${select(periodsSelection)}`

export const fetchPeriods = (id: DatasetId): CbsPeriodsPromise =>
  fetchJson(getPeriodsUrl(id)).then(getValues)

///////// DataProperties /////////
// Fetches Dimensions, TopicGroups and Topics

// const dataPropertiesSelection = [
//   'Key',
//   'Title',
//   'Type',
//   'Unit',
//   'Decimals',
//   'ParentID',
//   'ID',
// ]

const getDataPropertiesUrl = id =>
  // `${feedBaseUrl}/${id}/DataProperties?${select(dataPropertiesSelection)}`
  `${feedBaseUrl}/${id}/DataProperties`

export const fetchDataProperties = (id: DatasetId): CbsDataPropertiesPromise =>
  fetchJson(getDataPropertiesUrl(id)).then(getValues)

///////// CategoryGroups /////////

const categoryGroupSelection = ['ID', 'DimensionKey', 'Title', 'ParentID']

const getCategoryGroupsUrl = (id: DatasetId) =>
  `${feedBaseUrl}/${id}/CategoryGroups?${select(categoryGroupSelection)}`

export const fetchCategoryGroups = (id: DatasetId): CbsCategoryGroupsPromise =>
  fetchJson(getCategoryGroupsUrl(id)).then(getValues)

///////// Categories /////////

const categorySelection = ['Key', 'Title', 'CategoryGroupID']

const getCategoryUrl = ({
  id,
  cbsDimensionKey,
}: {
  id: DatasetId,
  cbsDimensionKey: DimensionKey,
}) => `${feedBaseUrl}/${id}/${cbsDimensionKey}?${select(categorySelection)}`

export const fetchCategory = (id: DatasetId) => (
  cbsDimensionKey: DimensionKey
): CbsCategoriesPromise =>
  fetchJson(getCategoryUrl({ id, cbsDimensionKey })).then(getValues)

///////// Dataset /////////

export const getDatasetUrl = (id: DatasetId) =>
  `${feedBaseUrl}/${id}/TypedDataSet`

const getDatasetSelection = (topicKeys: TopicKey[]) =>
  topicKeys.concat(['ID', 'Perioden'])

const getDatasetPeriodenFilter: (string[]) => string = compose(
  bracketize,
  join(' or '),
  map((cbsPeriod: string) => `(Perioden eq '${cbsPeriod})'`)
)

const getDatasetDimensionFilter = (
  [dimensionKey, categoryKeysForDimension]: [DimensionKey, CategoryKey[]]
): string =>
  compose(
    bracketize,
    join(' or '),
    map((categoryKey: CategoryKey) => `${dimensionKey} eq '${categoryKey}'`)
  )(categoryKeysForDimension)

const getDatasetDimensionsFilter: (categoryKeys: {
  [DimensionKey]: CategoryKey[],
}) => string = compose(
  bracketize,
  join(' and '),
  map(getDatasetDimensionFilter),
  Object.entries
)

const getDatasetFilter = ({ cbsPeriodKeys, categoryKeys }): string =>
  `$filter=${getDatasetPeriodenFilter(
    cbsPeriodKeys
  )} and ${getDatasetDimensionsFilter(categoryKeys)}`

export const getFilteredDatasetUrl = (window.getFilteredDatasetUrl = ({
  id,
  cbsPeriodKeys,
  topicKey,
  categoryKeys,
}: {
  id: DatasetId,
  cbsPeriodKeys: string[],
  topicKey: TopicKey[],
  categoryKeys: {
    [DimensionKey]: CategoryKey[],
  },
}): string =>
  `${getDatasetUrl(id)}?${getDatasetFilter({
    cbsPeriodKeys,
    categoryKeys,
  })}&${select(getDatasetSelection(topicKey))}`)

///////// Statline /////////

export const getStatlineUrl = (id: DatasetId) =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`
