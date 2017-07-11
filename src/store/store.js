import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { rehydrateState, managePersistence, rehydrateMetadata } from './persist'
import { reducers } from '../reducers/reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const startStore = () => {
  const preloadedState = rehydrateState()

  const store = createStore(
    reducers,
    preloadedState,
    composeEnhancers(applyMiddleware(thunk))
  )

  managePersistence(store)

  rehydrateMetadata(store)

  return store
}
