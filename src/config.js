import { minimalZero } from './helpers'
export const dataSetMaxSize = 2000

export const getDatasetFilter = datasetSize =>
  `$top=${dataSetMaxSize}&$skip=${minimalZero(datasetSize - dataSetMaxSize)}`

export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

export const getTableInfoUrl = id => `${apiBaseUrl}/${id}/TableInfos`

export const getDatasetUrl = id => `${feedBaseUrl}/${id}/TypedDataSet`

export const getFilteredDatasetUrl = ({ datasetSize, id }) =>
  `${getDatasetUrl(id)}?${getDatasetFilter(datasetSize)}`

export const getDatasetCountUrl = id => `${getDatasetUrl(id)}/$count`

export const getDataPropertiesUrl = id => `${apiBaseUrl}/${id}/DataProperties`

export const getStatlineUrl = id =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`

export const defaultPeriodLength = 10
