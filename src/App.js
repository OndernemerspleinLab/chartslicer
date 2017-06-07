import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
// import { Chart } from './Chart'
// import { DataInfo } from './DataInfo'
// import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig } from './config'
import { hemelblauw } from './colors'
// import { Placeholder } from './Placeholder'

css.global('*', {
  boxSizing: 'border-box',
})
css.global('html', {
  lineHeight: 1.5,
})

const Layout = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  [mqBig]: {
    justifyContent: 'stretch',
    flexDirection: 'row',
  },
})

const Sidebar = glamorous.div({
  flex: 'none',
})

const Main = glamorous.div({
  flex: 'auto',
  position: 'relative',
  backgroundColor: hemelblauw.lighter,
})

export const App = () =>
  <Layout>
    <Sidebar>
      <GraphPicker />
    </Sidebar>
    {/*<Main>
      <Placeholder />
      <DataInfo />
      <Chart />
      <DataTable />
    </Main>*/}
  </Layout>
