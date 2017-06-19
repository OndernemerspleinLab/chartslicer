import {
  datasetIdCleared,
  invalidDatasetIdSelected,
  datasetIdSelected,
  metadataLoadSuccess,
  metadataLoadError,
} from './actionCreators'
import { cbsIdExtractor } from '../helpers/cbsIdExtractor'
import { getMetadataPromise } from '../api/getMetadataPromise'
import { get } from '../helpers/getset'
import { existing } from '../helpers/helpers'
import { allMetadataLoadingStateConnector } from '../connectors/metadataLoadingStateConnectors'

const shouldFetch = itemNetworkState =>
  get('error')(itemNetworkState) ||
  (!get('loading')(itemNetworkState) && !get('loaded')(itemNetworkState))

export const shouldFetchForId = id => networkState =>
  existing(id) && shouldFetch(get(id)(networkState))

const fetchMetadata = ({ id }) => (dispatch, getState) => {
  const loadingState = allMetadataLoadingStateConnector(getState())

  if (!shouldFetchForId(id)(loadingState)) {
    dispatch(datasetIdSelected({ loaded: true, id }))
    return
  }

  dispatch(datasetIdSelected({ id }))

  getMetadataPromise(id).then(
    data => dispatch(metadataLoadSuccess(data)),
    error => dispatch(metadataLoadError({ id, error }))
  )
}

export const datasetSelectionChanged = ({ input }) => (dispatch, getState) => {
  if (!input) {
    dispatch(datasetIdCleared())
    return
  }

  const maybeId = cbsIdExtractor(input)

  if (!maybeId) {
    dispatch(invalidDatasetIdSelected({ input }))
    return
  }

  fetchMetadata({ id: maybeId })(dispatch, getState)
}
