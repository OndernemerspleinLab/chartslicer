import {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
} from 'redux'
import thunk from 'redux-thunk'
import * as actionCreators from './actionCreators'
import { connect } from 'react-redux'
import { composeReducers } from './reducers/reducerHelpers'
import {
  reduceLoading,
  reduceLoadSuccess,
  reduceLoadError,
  reduceInvalidId,
} from './reducers/networkStateReducer'
import {
  reduceActiveDataset,
  reduceInvalidActiveId,
} from './reducers/activeDatasetReducer'
import { reduceDatasets } from './reducers/datasetsReducer'
import { reduceConfig, reduceNewDatasetConfig } from './reducers/configReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export const connectActions = connect(null, mapDispatchToProps)

export const addReducers = () => {
  return composeReducers(
    reduceLoading,
    reduceLoadSuccess,
    reduceLoadError,
    reduceInvalidId,
    reduceActiveDataset,
    reduceDatasets,
    reduceInvalidActiveId,
    reduceNewDatasetConfig,
    reduceConfig
  )
}

export const startStore = () => {
  const reducers = addReducers()
  const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
  window.store = store
  return store
}
