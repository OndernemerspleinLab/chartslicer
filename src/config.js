export const apiOrigin = `https://opendata.cbs.nl`

export const apiBaseUrl = `${apiOrigin}/ODataApi/odata`
export const feedBaseUrl = `${apiOrigin}/ODataFeed/odata`

export const getTableInfoUrl = id => `${apiBaseUrl}/${id}/TableInfos`

export const getDataSetUrl = id => `${feedBaseUrl}/${id}/TypedDataSet`

export const getDataSetCountUrl = id => `${apiBaseUrl}/${id}/$count`

export const getDataPropertiesUrl = id => `${apiBaseUrl}/${id}/DataProperties`

export const getStatlineUrl = id =>
  `https://opendata.cbs.nl/#/CBS/nl/dataset/${id}/line`
