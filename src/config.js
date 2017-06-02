const fromYear = 2000

export const localStorageKey = 'redux'

const getPeriodFilter = (propName = 'Perioden') =>
  `$filter=substring(${propName},0,4) ge '${fromYear}'`

export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

export const getTableInfoUrl = id => `${feedBaseUrl}/${id}/TableInfos`

export const getDatasetUrl = id => `${feedBaseUrl}/${id}/TypedDataSet`

export const getDimensionGroupsUrl = id => `${feedBaseUrl}/${id}/CategoryGroups`

export const getDimensionUrl = ({ id, dimensionKey }) =>
  `${feedBaseUrl}/${id}/${dimensionKey}`

export const getFilteredDatasetUrl = id =>
  `${getDatasetUrl(id)}?${getPeriodFilter()}`

export const getDatasetCountUrl = id => `${getDatasetUrl(id)}/$count`

export const getDataPropertiesUrl = id => `${feedBaseUrl}/${id}/DataProperties`

export const getStatlineUrl = id =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`

export const defaultPeriodLength = 10

const breakpoint = 840

export const mqSmall = `@media (max-width: ${breakpoint - 1}px)`
export const mqBig = `@media (min-width: ${breakpoint}px)`

export const chartAspectRatio = 3 / 2
export const chartWidth = 350
export const chartHeight = chartWidth / chartAspectRatio
export const chartMaxWidth = `${100 * chartAspectRatio}vh`
