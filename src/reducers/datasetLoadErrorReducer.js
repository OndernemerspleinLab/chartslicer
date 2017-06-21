import { DATASET_LOAD_ERROR } from '../actions/actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'recompose'
import { setIn } from '../helpers/getset'

const reduceDatasetLoadError = (state, { id, query, error }) => {
  return setIn([id, query], {
    loading: false,
    loaded: false,
    error,
    id,
    query,
  })(state)
}

export const datasetLoadErrorReducer = compose(
  reduceIn('dataQueryLoadingState'),
  defaultState({}),
  reduceFor(DATASET_LOAD_ERROR)
)(reduceDatasetLoadError)
