import 'babel-polyfill'
import 'whatwg-fetch'
import 'url-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import 'glamor-reset'

import { startStore } from './store/store'

import { App } from './App'
import { Provider } from 'react-redux'

Array.from(document.getElementsByClassName('removeOnLoad')).forEach(element =>
  element.parentNode.removeChild(element)
)

const store = startStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
