import { getIn, get, setIn } from '../helpers/getset'
import { activeDatasetGetIdConnector } from './activeDatasetIdConnector'
import { MULTI_DIMENSION_CHANGED } from '../actions/actions'
import { dataQueryLoadingStateConnectorFor } from './datasetsLoadingStateConnectors'
import { activeDatasetGetQueryConnector } from './activeDatasetQueryConnector'
import { reduceFor } from '../reducers/reducerHelpers'
import { shouldFetch } from '../helpers/loadingStateHelpers'

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

export const dataEntriesConnector = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)

  return getIn(['dataEntries', activeDatasetId])(state) || {}
}

export const dataEntryConnector = (state, { entryId }) => {
  return get(entryId)(dataEntriesConnector(state))
}

const reduceMultiDimensionChangeVisibleDataset = (
  state,
  { activeDatasetId, multiDimension }
) => {
  const query = activeDatasetGetQueryConnector(state)
  const loadingState = dataQueryLoadingStateConnectorFor({
    id: activeDatasetId,
    query,
  })(state)

  if (!shouldFetch(loadingState)) {
    return setIn(
      ['dataQueries', activeDatasetId, query, 'multiDimension'],
      multiDimension
    )(state)
  }

  return state
}

export const multiDimensionChangeVisibleDatasetReducer = reduceFor(
  MULTI_DIMENSION_CHANGED
)(reduceMultiDimensionChangeVisibleDataset)
