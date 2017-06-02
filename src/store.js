import {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
} from 'redux'
import thunk from 'redux-thunk'
import * as actionCreators from './actionCreators'
import { tableSelectionChanged } from './actionCreators'
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
import { get } from './getset'
import { existing } from './helpers'
import { listenOn } from './domHelpers'
import { localStorageKey } from './config'

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

const manageUrl = ({ getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())

  if (existing(activeDatasetId)) {
    window.location.hash = activeDatasetId
  }
}

const persistState = ({ getState }) => () => {
  const stateWithConfig = { config: get('config')(getState()) }
  const json = JSON.stringify(stateWithConfig)

  try {
    localStorage.setItem(localStorageKey, json)
  } catch (error) {}
}

const getStateFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey))
  } catch (error) {}
}

const handleUrlChange = ({ dispatch, getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())
  const locationActiveDatasetId = window.location.hash.replace(/^#/, '')

  if (locationActiveDatasetId !== activeDatasetId && locationActiveDatasetId) {
    const datasetsNetworkState = get('datasetsNetworkState')(getState())
    dispatch(
      tableSelectionChanged({
        input: locationActiveDatasetId,
        datasetsNetworkState,
      })
    )
  }
}

export const startStore = () => {
  const reducers = addReducers()
  const preloadedState = getStateFromLocalStorage()
  const store = createStore(
    reducers,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
  )
  store.subscribe(persistState(store))
  store.subscribe(manageUrl(store))
  listenOn('hashchange', handleUrlChange(store))(window)
  handleUrlChange(store)()
  return store
}
