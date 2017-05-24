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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

let reducers = (state = {}) => state

export const connectActions = connect(null, mapDispatchToProps)

export const addReducer = reducer => {
  reducers = composeReducers(reducer, reducers)
}

export const startStore = () => {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
  window.store = store
  return store
}
