import React from 'react'
import { GraphPicker } from './GraphPicker'
import { css } from 'glamor'
import { Chart } from './Chart'
import { DataInfo } from './DataInfo'
import { DataTable } from './DataTable'
import glamorous from 'glamorous'
import { mqBig } from './config'
import { hemelblauw } from './colors'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'
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
  },
})

const Sidebar = glamorous.div({
  flex: 'none',
})

const pulseAnimation = css.keyframes({
  from: {
    backgroundSize: '100%',
  },
  to: {
    backgroundSize: '200%',
  },
})

const mainBackgroundColor = hemelblauw.lighter
const maskGapColor = Color(mainBackgroundColor).alpha(0.3)

const pulseAnimationPropValue = `1200ms ease-in-out infinite alternate ${pulseAnimation}`
const MainComp = glamorous.div(
  {
    flex: 'auto',
    backgroundImage: `radial-gradient(circle, ${maskGapColor}, ${mainBackgroundColor} 20%)`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    backgroundColor: mainBackgroundColor,
    transition: 'background-color 300ms ease-in-out',
    backgroundAttachment: 'fixed',
    animation: `${pulseAnimationPropValue}`,
  },
  ({ loading }) =>
    loading
      ? {
          backgroundColor: hemelblauw.light,
          transitionDelay: '200ms',
        }
      : null
)

const Main = connectActiveDatasetsNetworkState('loading')(MainComp)

export const App = () => (
  <Layout>
    <Sidebar>
      <GraphPicker />
    </Sidebar>
    <Main>
      <DataInfo />
      <Chart />
      <DataTable />
    </Main>
  </Layout>
)
