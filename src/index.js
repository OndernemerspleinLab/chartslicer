import 'babel-polyfill'
import 'whatwg-fetch'
import 'url-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import 'glamor-reset'

import { startStore } from './store'

import { App } from './App'
import { Provider } from 'react-redux'

// import reducers
import './reducers/datasetsReducer'
import './reducers/activeDatasetReducer'
import './reducers/networkStateReducer'

const store = startStore()

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
