import React from 'react'
import { compose } from 'recompose'
import {
  VictoryTheme,
  VictoryAxis,
  VictoryChart,
  VictoryArea,
  VictoryScatter,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLabel,
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
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { get, getIn } from './helpers/getset'
import { dataEntriesConnector } from './connectors/visibleDatasetQueryConnector'
import { connect } from 'react-redux'
import { formatCbsPeriod, getCbsPeriodLabel } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { DataSource } from './DataSource'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
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
const DataChartComp = glamorous.div({
  animation: fadeInAnimation,
  maxWidth: '60rem',
  position: 'relative',
})

const yAxisStyle = {
  tickLabels: {
    fontSize: '7px',
    padding: 5,
  },
  axisLabel: {
    fontSize: '7px',
    textAnchor: 'start',
    fontWeight: 'bold',
  },
}

const yAxisDomain = [0]

const xAxisStyle = {
  tickLabels: {
    fontSize: '7px',
    padding: 5,
  },
  axisLabel: {
    fontSize: '7px',
    padding: 28,
    fontWeight: 'bold',
  },
}

const chartStyle = { parent: chartParentStyle }
const chartDomainPadding = { y: [10, 10], x: [0, 0] }

const areaStyle = {
  data: {
    fill: `url(#MyGradient)`,
    strokeWidth: 1,
    strokeLinejoin: 'round',
    stroke: hemelblauw.default,
  },
}

const scatterStyle = {
  data: {
    fill: (data, active) => (active ? hemelblauw.darker : hemelblauw.default),
  },
}

const DataChartContainer = ({
  topic,
  language,
  dataList,
  periodType,
  dataEntries,
}) => {
  const topicKey = get('key')(topic)
  const getTopicValue = dataEntryKey =>
    getIn([dataEntryKey, topicKey])(dataEntries)
  const getPeriodDate = dataEntryKey =>
    getIn([dataEntryKey, 'periodDate'])(dataEntries)

  const formatPeriod = formatCbsPeriod(periodType)

  const periodLabel = getCbsPeriodLabel({ language, periodType })

  const Gradient = () => (
    <linearGradient id="MyGradient" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={hemelblauw.default} stopOpacity={0.3} />
      <stop offset="50%" stopColor={hemelblauw.default} stopOpacity={0} />
    </linearGradient>
  )

  return (
    <DataChartComp>
      <Rectangle>
        <VictoryChart
          width={chartWidth}
          height={chartHeight}
          style={chartStyle}
          theme={VictoryTheme.material}
          domainPadding={chartDomainPadding}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <Gradient />
          <VictoryAxis
            dependentAxis
            fixLabelOverlap
            label={get('unit')(topic)}
            tickFormat={formatNumber(get('decimals')(topic))}
            domain={yAxisDomain}
            style={yAxisStyle}
            axisLabelComponent={<VictoryLabel x={20} y={46} angle={0} />}
          />
          <VictoryAxis
            fixLabelOverlap
            tickValues={dataList.map(getPeriodDate)}
            tickFormat={formatPeriod('\n')}
            label={periodLabel}
            scale="time"
            style={xAxisStyle}
          />
          <VictoryArea
            data={dataList}
            x={getPeriodDate}
            y={getTopicValue}
            style={areaStyle}
          />
          <VictoryScatter
            data={dataList}
            x={getPeriodDate}
            y={getTopicValue}
            style={scatterStyle}
            size={2}
            labels={({ x, y }) => [
              `${formatPeriod(' ')(x)}`,
              `${formatNumber(get('decimals')(topic))(y)}`,
            ]}
            labelComponent={
              <VictoryTooltip
                cornerRadius={1}
                dy={-2}
                pointerLength={4}
                pointerWidth={4}
                style={{
                  fontSize: '5px',
                  fill: hemelblauw.darker,
                }}
                flyoutStyle={{
                  strokeWidth: 0.5,
                  stroke: hemelblauw.darker,
                  fill: wit,
                }}
              />
            }
          />
        </VictoryChart>
        <DataSource />
      </Rectangle>
    </DataChartComp>
  )
}
export const DataChart = enhancer(DataChartContainer)
