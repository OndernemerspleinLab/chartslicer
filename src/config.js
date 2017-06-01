import { minimalZero } from './helpers'
const dataSetMaxSize = 2000

const fromYear = 2005

const getPeriodFilter = (propName = 'Perioden') =>
  `$filter=substring(${propName},0,4) ge '${fromYear}'`

export const getDatasetFilter = datasetSize =>
  `$top=${dataSetMaxSize}&$skip=${minimalZero(datasetSize - dataSetMaxSize)}&${getPeriodFilter()}`

export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

export const getTableInfoUrl = id => `${feedBaseUrl}/${id}/TableInfos`

export const getDatasetUrl = id => `${feedBaseUrl}/${id}/TypedDataSet`

export const getDimensionGroupsUrl = id => `${feedBaseUrl}/${id}/CategoryGroups`

export const getDimensionUrl = ({ id, dimensionKey }) =>
  `${feedBaseUrl}/${id}/${dimensionKey}`

export const getFilteredDatasetUrl = ({ datasetSize, id }) =>
  `${getDatasetUrl(id)}?${getDatasetFilter(datasetSize)}`

export const getDatasetCountUrl = id => `${getDatasetUrl(id)}/$count`

export const getDataPropertiesUrl = id => `${feedBaseUrl}/${id}/DataProperties`

export const getStatlineUrl = id =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`

export const defaultPeriodLength = 10

const breakpoint = 840

export const mqSmall = `@media (max-width: ${breakpoint - 1}px)`
export const mqBig = `@media (min-width: ${breakpoint}px)`
