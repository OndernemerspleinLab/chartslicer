import { getIn, get } from '../helpers/getset'
import { activeDatasetGetIdConnector } from './activeDatasetIdConnector'

export const visibleDatasetGetQueryConnectorFor = activeDatasetId => state => {
  return getIn(['visibleDatasetQueries', activeDatasetId])(state)
}
export const visibleDatasetGetQueryConnector = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)
  return visibleDatasetGetQueryConnectorFor(activeDatasetId)(state)
}
export const visibleDatasetQueryConnector = state => {
  return { visibleDatasetQuery: visibleDatasetGetQueryConnector(state) }
}

export const visibleDatasetInfoConnector = state => {
  const visibleDatasetQuery = visibleDatasetGetQueryConnector(state)
  const activeDatasetId = activeDatasetGetIdConnector(state)

  return (
    getIn(['dataQueries', activeDatasetId, visibleDatasetQuery])(state) || {}
  )
}

export const dataEntriesGetConnector = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)

  return getIn(['dataEntries', activeDatasetId])(state) || {}
}

export const dataEntriesConnector = state => {
  return { dataEntries: dataEntriesGetConnector(state) }
}

export const dataEntryConnector = (state, { entryId }) => {
  return get(entryId)(dataEntriesGetConnector(state))
}
