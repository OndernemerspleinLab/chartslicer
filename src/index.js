import 'babel-polyfill'
import 'whatwg-fetch'
import 'url-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import 'glamor-reset'
import { App } from './App'
import { startStore } from './store'
import './reducers/tableInfoReducer'
import { Provider } from 'react-redux'

const store = startStore()

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
