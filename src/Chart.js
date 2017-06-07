import React from 'react'
import { compose } from 'recompose'
import {
  onlyWhenLoaded,
  connectFilteredDataset,
  connectDataInfo,
  onlyWhenData,
} from './higherOrderComponents'
import {
  VictoryTheme,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryGroup,
} from 'victory'
import glamorous from 'glamorous'
import { hemelblauw, wit } from './colors'
import { fadeInAnimation } from './styles'
import {
  chartAspectRatio,
  chartWidth,
  chartHeight,
  chartMaxWidth,
} from './config'
import { connectPeriodFormatter } from './cbsPeriod'

const enhancer = compose(
  onlyWhenLoaded,
  connectPeriodFormatter,
  connectDataInfo,
  connectFilteredDataset,
  onlyWhenData
)

const chartParentStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: wit,
  border: `1px solid ${hemelblauw.light}`,
}

const Rectangle = glamorous.div({
  position: 'relative',
  maxWidth: chartMaxWidth,
  ':before': {
    content: '""',
    display: 'block',
    position: 'relative',
    paddingBottom: `${100 / chartAspectRatio}%`,
    maxHeight: '100vh',
  },
})
const ChartComp = glamorous.div({
  animation: fadeInAnimation,
  padding: '0 3rem',
  maxWidth: '60rem',
})
const ChartContainer = ({ topicKey, data, formatPeriod, topic, periodType }) =>
  <ChartComp>
    <Rectangle>
      <VictoryChart
        width={chartWidth}
        height={chartHeight}
        style={{ parent: chartParentStyle }}
        theme={VictoryTheme.material}
        domainPadding={0}
      >
        <VictoryAxis
          dependentAxis
          fixLabelOverlap
          label={`${topic.Title} (${topic.Unit})`}
          domain={[0]}
          style={{
            tickLabels: {
              fontSize: '7px',
              padding: 5,
            },
            axisLabel: {
              fontSize: '7px',
              padding: 35,
            },
          }}
        />
        <VictoryAxis
          fixLabelOverlap
          tickValues={data.map(({ Perioden }) => formatPeriod(Perioden))}
          label={periodType}
          scale="time"
          style={{
            tickLabels: {
              fontSize: '7px',
              padding: 5,
            },
            axisLabel: {
              fontSize: '7px',
              padding: 25,
            },
          }}
        />
        <VictoryGroup>
          <VictoryLine
            data={data}
            x="Perioden"
            y={topicKey}
            style={{
              data: {
                strokeWidth: 1,
                stroke: hemelblauw.grijscontrast,
              },
            }}
          />
        </VictoryGroup>
      </VictoryChart>
    </Rectangle>

  </ChartComp>

export const Chart = enhancer(ChartContainer)
