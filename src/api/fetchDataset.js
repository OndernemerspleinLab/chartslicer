import { getFilteredDatasetUrl } from './apiUrls'
import { fetchJson } from './fetch'
import { get } from '../helpers/getset'
import { flatten } from 'lodash/fp'
const fetchDataset = id => fetchJson(getFilteredDatasetUrl(id))

const fetchNextDataset = (datasetList = []) => dataResponse => {
  const partialDataset = get('value')(dataResponse)
  const nextLink = get('odata.nextLink')(dataResponse)
  datasetList.push(partialDataset)

  if (nextLink) {
    const httpsNextLink = nextLink.replace(/^http:/, 'https:')
    return fetchJson(httpsNextLink).then(fetchNextDataset(datasetList))
  }

  return datasetList
}

const fetchFullDataset = id =>
  fetchDataset(id).then(fetchNextDataset([])).then(flatten)
