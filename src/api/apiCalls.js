// @flow

import { bracketize } from '../helpers/helpers'
import { map, join, sortBy, identity, concat, defaultTo } from 'lodash/fp'
import { compose } from 'recompose'
import { fetchJson, customError } from './fetch'
import { get, getIn } from '../helpers/getset'
import type {
  DatasetId,
  DimensionKey,
  Key,
  CategoryKey,
  ConfigState,
  DatasetQuery,
} from '../store/stateShape'
import type {
  CbsDataPropertiesPromise,
  CbsTableInfoPromise,
  CbsCategoryGroupsPromise,
  CbsCategoriesPromise,
  CbsPeriodsPromise,
  CbsDataEntriesPromise,
} from './apiShape'
import { createCbsPeriods } from '../cbsPeriod'

const getOnlyValue = responseBody => getIn(['value', 0])(responseBody) || {}
const getValues = responseBody => get('value')(responseBody) || []

const select = (keys: string[]) =>
  `$select=${encodeURIComponent(keys.join(','))}`
const filter = (filterString: string) =>
  `$filter=${encodeURIComponent(filterString)}`

export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
// export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

///////// TableInfo /////////

const tableInfoSelection = ['Title', 'GraphTypes', 'Language']

const getTableInfoUrl = (id: DatasetId) =>
  `${apiBaseUrl}/${id}/TableInfos?${select(tableInfoSelection)}`

export const fetchTableInfo = (id: DatasetId): CbsTableInfoPromise =>
  fetchJson(getTableInfoUrl(id)).then(getOnlyValue)

///////// Periods /////////

const periodsSelection = ['Key']

const getCbsPeriodKey = (language: string) => {
  switch (language) {
    case 'en':
      return 'Periods'
    case 'nl':
    default:
      return 'Perioden'
  }
}

const getPeriodsUrl = ({
  id,
  language,
}: {
  id: DatasetId,
  language: string,
}) => {
  return `${apiBaseUrl}/${id}/${getCbsPeriodKey(language)}?${select(
    periodsSelection
  )}`
}

const cunstomPeriodError = customError({
  predicate: error => {
    return getIn(['response', 'status'])(error) === 404
  },
  message: 'Dataset does not have a time dimension',
})

export const fetchPeriods = ({
  id,
  language,
}: {
  id: DatasetId,
  language: string,
}): CbsPeriodsPromise =>
  cunstomPeriodError(fetchJson(getPeriodsUrl({ id, language })).then(getValues))

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
  // `${apiBaseUrl}/${id}/DataProperties?${select(dataPropertiesSelection)}`
  `${apiBaseUrl}/${id}/DataProperties`

export const fetchDataProperties = (id: DatasetId): CbsDataPropertiesPromise =>
  fetchJson(getDataPropertiesUrl(id)).then(getValues)

///////// CategoryGroups /////////

const categoryGroupSelection = ['ID', 'DimensionKey', 'Title', 'ParentID']

const getCategoryGroupsUrl = (id: DatasetId) =>
  `${apiBaseUrl}/${id}/CategoryGroups?${select(categoryGroupSelection)}`

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
}) => `${apiBaseUrl}/${id}/${cbsDimensionKey}?${select(categorySelection)}`

export const fetchCategory = (id: DatasetId) => (
  cbsDimensionKey: DimensionKey
): CbsCategoriesPromise =>
  fetchJson(getCategoryUrl({ id, cbsDimensionKey })).then(getValues)

///////// Dataset /////////

export const getDatasetUrl = ({
  id,
  query,
}: {
  id: DatasetId,
  query: DatasetQuery,
}) => `${apiBaseUrl}/${id}/TypedDataSet?${query}`

const getDatasetSelection: string => (keys: Key[]) => string[] = language =>
  compose(
    concat(['ID', getCbsPeriodKey(language)]),
    sortBy(identity),
    defaultTo([])
  )

const getDatasetPeriodenFilter: string => (string[]) => string = language =>
  compose(
    bracketize,
    join(' or '),
    map(
      (cbsPeriod: string) => `(${getCbsPeriodKey(language)} eq '${cbsPeriod}')`
    )
  )

const getDatasetDimensionFilter = (
  [dimensionKey, categoryKeysForDimension]: [DimensionKey, CategoryKey[]]
): string =>
  compose(
    bracketize,
    join(' or '),
    map((categoryKey: CategoryKey) => `${dimensionKey} eq '${categoryKey}'`),
    sortBy(identity)
  )(categoryKeysForDimension)

const getDatasetDimensionsFilter: (categoryKeys: {
  [DimensionKey]: CategoryKey[],
}) => string = compose(
  join(' and '),
  map(getDatasetDimensionFilter),
  sortBy(([dimensionKey]) => dimensionKey),
  Object.entries
)

const getDatasetFilter = ({ cbsPeriodKeys, categoryKeys, language }): string =>
  filter(
    `${getDatasetPeriodenFilter(language)(
      cbsPeriodKeys
    )} and ${getDatasetDimensionsFilter(categoryKeys)}`
  )

export type ConfigWithDate = ConfigState & { language: string, now: Date }

export const getDatasetQueryString = ({
  id,
  periodLength,
  periodType,
  now,
  topicKeys,
  language,
  categoryKeys,
}: ConfigWithDate): string =>
  `${getDatasetFilter({
    cbsPeriodKeys: createCbsPeriods({ endDate: now, periodType, periodLength }),
    categoryKeys,
    language,
  })}&${select(
    getDatasetSelection(language)(concat(Object.keys(categoryKeys))(topicKeys))
  )}`

export const fetchFilteredDataset = ({
  id,
  query,
}: {
  id: DatasetId,
  query: DatasetQuery,
}): CbsDataEntriesPromise =>
  fetchJson(getDatasetUrl({ id, query })).then(getValues)

///////// Statline /////////

export const getStatlineUrl = (id: DatasetId) =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`
