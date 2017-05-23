import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'

css.global('*', {
  boxSizing: 'border-box',
})
css.global('html', {
  lineHeight: 1.5,
})
export const App = () => <div><GraphPicker /></div>
