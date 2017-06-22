import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
// import { Chart } from './Chart'
import { DataInfo } from './DataInfo'
import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig, sidebarWidth } from './config'
import { hemelblauw, violet } from './colors'
import { Placeholder } from './Placeholder'
import Color from 'color'

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
    height: '100vh',
  },
})

const sideScrollbarStyle = {
  '::-webkit-scrollbar': {
    width: '0.5rem',
    height: '0.5rem',
  },
  '::-webkit-scrollbar-track': {
    backgroundColor: Color(violet.lightest).lighten(0.04).string(),
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: violet.darker,
    borderRadius: '999px',
    border: `1px solid ${Color(violet.lightest).lighten(0.04).string()}`,
  },
}

const mainScrollbarStyle = {
  '::-webkit-scrollbar': {
    width: '0.5rem',
    height: '0.5rem',
  },
  '::-webkit-scrollbar-track': {
    backgroundColor: Color(hemelblauw.lighter).lighten(0.04).string(),
  },

  '::-webkit-scrollbar-thumb': {
    backgroundColor: hemelblauw.darker,
    borderRadius: '999px',
    border: `1px solid ${Color(hemelblauw.lighter).lighten(0.04).string()}`,
  },
}

const Sidebar = glamorous.div(sideScrollbarStyle, {
  flex: 'none',
  overflowX: 'hidden',
  overflowY: 'auto',
  width: sidebarWidth,
  borderRight: `2px solid ${violet.default}`,
})

const Main = glamorous.div(mainScrollbarStyle, {
  flex: 'auto',
  position: 'relative',
  backgroundColor: hemelblauw.lighter,
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const App = () =>
  <Layout>
    <Sidebar>
      <GraphPicker />
    </Sidebar>
    <Main>
      <Placeholder />
      <DataInfo />
      {/*<Chart />*/}
      <DataTable />
    </Main>
  </Layout>
