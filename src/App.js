import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
import { Chart } from './Chart'
import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig } from './config'

css.global('*', {
  boxSizing: 'border-box',
})
css.global('html', {
  lineHeight: 1.5,
})

const Layout = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  [mqBig]: {
    flexDirection: 'row',
  },
})

const Sidebar = glamorous.div({
  flex: 'none',
})

const Main = glamorous.div({
  flex: 'auto',
})

export const App = () => (
  <Layout>
    <Sidebar>
      <GraphPicker />
    </Sidebar>
    <Main>
      <Chart />
      <DataTable />
    </Main>
  </Layout>
)
