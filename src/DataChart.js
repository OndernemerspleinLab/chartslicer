import React from 'react'
import { compose } from 'recompose'
import {
  VictoryTheme,
  VictoryAxis,
  VictoryChart,
  VictoryArea,
  VictoryLine,
  VictoryScatter,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLabel,
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
  chartColors,
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

const areaStyle = ({ colorId }) => ({
  data: {
    fill: `url(#${colorId})`,
  },
})

const lineStyle = ({ color, colorId }) => ({
  data: {
    strokeWidth: 1,
    strokeLinejoin: 'round',
    stroke: color,
  },
})

const scatterStyle = ({ color, colorDarker }) => ({
  data: {
    fill: (data, active) => (active ? colorDarker : color),
  },
})

const DataChartContainer = ({
  topic,
  language,
  periodType,
  dataEntries,
  dataGroupsList,
}) => {
  const topicKey = get('key')(topic)
  const getValue = dataEntry => get('value')(dataEntry)
  const getPeriodDate = dataEntry => get('periodDate')(dataEntry)

  const formatPeriod = formatCbsPeriod(periodType)

  const periodLabel = getCbsPeriodLabel({ language, periodType })

  const Gradient = ({ color, colorId }) => (
    <linearGradient id={colorId} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
      <stop offset="50%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  )

  const Area = ({ dataEntryList, color, colorId }) => {
    return (
      <VictoryArea
        key={`area-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={areaStyle({ color, colorId })}
        labels={({ x, y }) => [
          `${formatPeriod(' ')(x)}`,
          `${formatNumber(get('decimals')(topic))(y)}`,
        ]}
      />
    )
  }

  const Wrapper = ({ children }) => children

  const Line = ({ dataEntryList, color, colorId, colorDarker, symbol }) => {
    return [
      <VictoryLine
        key={`area-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={lineStyle({ color, colorId })}
      />,
      <VictoryScatter
        key={`scatter-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={scatterStyle({ color, colorDarker })}
        size={2}
        symbol={symbol}
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
      />,
    ]
  }

  console.log('dataGroupsList', dataGroupsList)

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
          {chartColors.map(({ color, colorId }) => (
            <Gradient color={color} colorId={colorId} key={colorId} />
          ))}
          <VictoryAxis
            dependentAxis
            label={get('unit')(topic)}
            tickFormat={formatNumber(get('decimals')(topic))}
            style={yAxisStyle}
            axisLabelComponent={<VictoryLabel x={20} y={46} angle={0} />}
          />
          <VictoryAxis
            fixLabelOverlap
            tickValues={dataGroupsList[0].dataEntryList.map(getPeriodDate)}
            tickFormat={formatPeriod('\n')}
            label={periodLabel}
            scale="time"
            style={xAxisStyle}
          />
          {dataGroupsList.map((props, index) =>
            Area({ ...props, ...chartColors[index] })
          )}
          {dataGroupsList.map((props, index) =>
            Line({ ...props, ...chartColors[index] })
          )}
        </VictoryChart>
        <DataSource />
      </Rectangle>
    </DataChartComp>
  )
}
export const DataChart = enhancer(DataChartContainer)
