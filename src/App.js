import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
import { DataChart } from './DataChart'
import { DataInfo } from './DataInfo'
import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig, sidebarWidth } from './config'
import { hemelblauw, violet } from './colors'
import { Placeholder } from './Placeholder'
import Color from 'color'
import { QueryDataLoadingIndicator } from './Loading'
import { DataQueryError } from './DataQueryError'

css.global('*', {
  boxSizing: 'border-box',
})
css.global('html', {
  lineHeight: 1.5,
  color: hemelblauw.darkest,
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
  [mqBig]: {
    borderRight: `2px solid ${violet.default}`,
    width: sidebarWidth,
  },
})

const Main = glamorous.div(mainScrollbarStyle, {
  flex: 'auto',
  position: 'relative',
  backgroundColor: hemelblauw.lighter,
})

const MainScrollArea = glamorous.div(mainScrollbarStyle, {
  width: '100%',
  height: '100%',
  flex: 'auto',
  position: 'relative',
  overflowX: 'hidden',
  overflowY: 'auto',
  padding: '0 1rem',
  [mqBig]: {
    padding: '0 3rem',
  },
})

export const App = () =>
  <Layout>
    <Sidebar>
      <GraphPicker />
    </Sidebar>
    <Main>
      <MainScrollArea>
        <Placeholder />
        <DataInfo />
        <DataChart />
        <DataTable />
      </MainScrollArea>
      <QueryDataLoadingIndicator />
      <DataQueryError />
    </Main>
  </Layout>
