import React from 'react'
import { compose } from 'recompose'
import { onlyWhenLoaded, connectFilteredDataset } from './higherOrderComponents'
import { VictoryTheme, VictoryAxis, VictoryChart, VictoryLine } from 'victory'
import glamorous from 'glamorous'
import { violet } from './colors'

const enhancer = compose(onlyWhenLoaded, connectFilteredDataset)

const chartParentStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const Square = glamorous.div({
  position: 'relative',
  maxWidth: '100vh',
  ':before': {
    content: '""',
    display: 'block',
    position: 'relative',
    paddingBottom: '100%',
    maxHeight: '100vh',
  },
})
const ChartComp = glamorous.div({})
const ChartContainer = ({ topicKey, data }) => (
  <ChartComp>
    <Square>
      <VictoryChart
        width={350}
        height={350}
        domainPadding={0}
        style={{ parent: chartParentStyle }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          dependentAxis
          fixLabelOverlap
          style={{
            tickLabels: {
              fontSize: '7px',
            },
          }}
        />
        <VictoryAxis
          fixLabelOverlap
          style={{
            tickLabels: {
              fontSize: '7px',
            },
          }}
        />
        <VictoryLine
          interpolation="catmullRom"
          data={data}
          x="Perioden"
          y={topicKey}
          style={{
            data: {
              strokeWidth: 1,
              stroke: violet.default,
            },
          }}
        />
      </VictoryChart>
    </Square>

  </ChartComp>
)

export const Chart = enhancer(ChartContainer)
