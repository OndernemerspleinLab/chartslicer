import React from 'react'
import { compose } from 'recompose'
import { onlyWhenLoaded, connectFilteredDataset } from './higherOrderComponents'
import { VictoryTheme, VictoryAxis, VictoryChart, VictoryLine } from 'victory'
import glamorous from 'glamorous'

const enhancer = compose(onlyWhenLoaded, connectFilteredDataset)

const chartParentStyle = {
  maxHeight: '100vh',
  maxWidth: '100vh',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

const Square = glamorous.div({
  position: 'relative',
  ':before': {
    content: '""',
    display: 'block',
    position: 'relative',
    paddingBottom: '100%',
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
          data={data}
          x="Perioden"
          y={topicKey}
          style={{
            data: {
              strokeWidth: 1,
              opacity: 0.5,
            },
          }}
        />
      </VictoryChart>
    </Square>

  </ChartComp>
)

export const Chart = enhancer(ChartContainer)
