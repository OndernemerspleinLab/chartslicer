import React from 'react'
import { compose } from 'recompose'
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
import { visibleDataInfoEnhancer } from './enhancers/visibleDataInfoEnhancer'
import {
  onlyWhenVisibleDataset,
  onlyWhenActiveQueryLoading,
} from './enhancers/datasetEnhancer'
import { get, getIn } from './helpers/getset'
import { dataEntriesConnector } from './connectors/visibleDatasetQueryConnector'
import { connect } from 'react-redux'
import { formatCbsPeriod } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { Loading } from './Loading'

const enhancer = compose(
  onlyWhenVisibleDataset,
  visibleDataInfoEnhancer,
  connect(dataEntriesConnector)
)

const chartParentStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: wit,
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
const DataChartComp = glamorous.div({
  animation: fadeInAnimation,
  margin: '0 3rem',
  maxWidth: '60rem',
  position: 'relative',
  border: `1px solid ${hemelblauw.light}`,
})

const DataLoadingIndicator = onlyWhenActiveQueryLoading(Loading)

const DataChartContainer = ({ topic, dataList, periodType, dataEntries }) => {
  const topicKey = get('key')(topic)
  const getTopicValue = dataEntryKey =>
    getIn([dataEntryKey, topicKey])(dataEntries)
  const getPeriodDate = dataEntryKey =>
    getIn([dataEntryKey, 'periodDate'])(dataEntries)

  const formatPeriod = formatCbsPeriod(periodType)

  return (
    <DataChartComp>
      <DataLoadingIndicator />
      <Rectangle>
        <VictoryChart
          width={chartWidth}
          height={chartHeight}
          style={{ parent: chartParentStyle }}
          theme={VictoryTheme.material}
          domainPadding={{ y: [10, 10], x: [0, 0] }}
        >
          <VictoryAxis
            dependentAxis
            fixLabelOverlap
            label={get('unit')(topic)}
            tickFormat={formatNumber(get('decimals')(topic))}
            domain={[0]}
            style={{
              tickLabels: {
                fontSize: '7px',
                padding: 5,
              },
              axisLabel: {
                fontSize: '7px',
                padding: 40,
              },
            }}
          />
          <VictoryAxis
            fixLabelOverlap
            tickValues={dataList.map(getPeriodDate)}
            tickFormat={formatPeriod}
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
              data={dataList}
              x={getPeriodDate}
              y={getTopicValue}
              interpolation="catmullRom"
              style={{
                data: {
                  strokeWidth: 1.5,
                  stroke: hemelblauw.grijscontrast,
                },
              }}
            />
          </VictoryGroup>
        </VictoryChart>
      </Rectangle>
    </DataChartComp>
  )
}
export const DataChart = enhancer(DataChartContainer)