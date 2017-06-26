import { METADATA_LOAD_SUCCESS } from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import { get, set } from '../helpers/getset'

const reduceMetadata = metadataName => (metadataContainer, action) => {
  const metadataForId = get(metadataName)(action)
  const id = get('id')(action)

  return set(id, metadataForId)(metadataContainer)
}

const reduceMetadataState = metadataName =>
  compose(
    reduceIn(metadataName),
    defaultState({}),
    reduceFor(METADATA_LOAD_SUCCESS)
  )(reduceMetadata(metadataName))

const metadataNames = [
  'tableInfo',
  'topicGroups',
  'topics',
  'dimensions',
  'categoryGroups',
  'categories',
]

export const metadataReducer = composeReducers(
  ...metadataNames.map(reduceMetadataState)
)
