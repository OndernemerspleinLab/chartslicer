import {
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
} from 'redux'
import { reducers } from './reducers'
import thunk from 'redux-thunk'
import * as actionCreators from './actionCreators'
import { connect } from 'react-redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const startStore = () => {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
  return store
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export const connectActions = connect(null, mapDispatchToProps)
