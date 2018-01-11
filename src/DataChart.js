import React from 'react'
import { compose } from 'recompose'
import {
  VictoryAxis,
  VictoryArea,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryLabel,
  VictoryLegend,
} from 'victory'
import glamorous from 'glamorous'
import { fadeInAnimation } from './styles'
import {
  chartAspectRatio,
  chartMaxWidth,
  chartColors,
  chartXAxisTickCount,
} from './config'
import {
  visibleDataInfoEnhancer,
  onlyWhenDataGroupsList,
} from './enhancers/visibleDataInfoEnhancer'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { get, getIn } from './helpers/getset'
import { connect } from 'react-redux'
import { formatCbsPeriod, formatWithNewYearFactory } from './cbsPeriod'
import { formatNumber, existing } from './helpers/helpers'
import { DataSource } from './DataSource'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import { ChartWrapper, ChartLineGradient } from './DataChartElements'
import {
  xAxisStyleFactory,
  xAxisLineTickLabelLineHeight,
  yAxisStyleFactory,
  legendPropsFactory,
  lineStyleFactory,
  areaStyleFactory,
  scatterStyleFactory,
  tooltipPropsFactory,
  tooltipLineHeight,
  getTooltipXDelta,
  getTooltipYDelta,
  getTooltipOrientation,
} from './chartStyle'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
  visibleDataInfoEnhancer,
  onlyWhenDataGroupsList
)

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
  maxWidth: '40rem',
  position: 'relative',
})

const getLegendData = ({ symbol, color, title }) => ({
  name: title,
  symbol: {
    type: symbol,
    fill: color,
  },
})

const DataChartContainer = ({
  language,
  periodType,
  dataEntries,
  dataGroupsList,
  unit,
  decimals,
}) => {
  const getValue = dataEntry => get('value')(dataEntry)
  const getPeriodDate = dataEntry => get('periodDate')(dataEntry)

  const formatPeriod = formatCbsPeriod(periodType)

  const formatTooltipUnit = unit => (existing(unit) ? ` (${unit})` : '')

  const Area = ({
    dataEntryList,
    color,
    colorDarker,
    colorId,
    title,
    unit,
  }) => {
    return (
      <VictoryArea
        key={`area-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={areaStyleFactory({ color, colorId })}
        labels={({ x, y }) => [
          `${formatPeriod(' ')(x)}`,
          `${title}${formatTooltipUnit(unit)}: ${formatNumber(decimals)(y)}`,
        ]}
        labelComponent={
          <VictoryTooltip
            {...tooltipPropsFactory({ color, colorDarker })}
            labelComponent={<VictoryLabel lineHeight={tooltipLineHeight} />}
            dx={getTooltipXDelta(dataEntryList)}
            dy={getTooltipYDelta(dataEntryList)}
            orientation={getTooltipOrientation(dataEntryList)}
          />
        }
      />
    )
  }

  const Line = ({ dataEntryList, color, colorId, colorDarker, symbol }) => {
    return [
      <VictoryLine
        key={`line-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={lineStyleFactory({ color, colorId })}
      />,
      <VictoryScatter
        key={`scatter-${colorId}`}
        data={dataEntryList}
        x={getPeriodDate}
        y={getValue}
        style={scatterStyleFactory({ color, colorDarker })}
        symbol={symbol}
      />,
    ]
  }

  const firstDataEntryList = getIn(['0', 'dataEntryList'])(dataGroupsList)

  return (
    <DataChartComp>
      <Rectangle>
        <ChartWrapper>
          {dataGroupsList.map(({ min, max }, index) => {
            const chartColor = chartColors[index]

            return (
              <ChartLineGradient
                key={`gradient-${chartColor.colorId}`}
                {...chartColor}
                min={min}
                max={max}
              />
            )
          })}
          <VictoryLegend
            {...legendPropsFactory({})}
            data={dataGroupsList.map(({ title }, index) =>
              getLegendData({ title, ...chartColors[index] })
            )}
          />
          <VictoryAxis
            tickValues={firstDataEntryList.map(getPeriodDate)}
            tickFormat={formatWithNewYearFactory(periodType)}
            scale="time"
            style={xAxisStyleFactory({})}
            tickCount={chartXAxisTickCount}
            tickLabelComponent={
              <VictoryLabel lineHeight={xAxisLineTickLabelLineHeight} />
            }
          />
          <VictoryAxis
            dependentAxis
            label={unit}
            tickFormat={number => formatNumber({ decimals, number })}
            style={yAxisStyleFactory({})}
          />
          {dataGroupsList.map((props, index) =>
            Area({ ...props, ...chartColors[index], unit })
          )}
          {dataGroupsList.map((props, index) =>
            Line({ ...props, ...chartColors[index] })
          )}
        </ChartWrapper>
        <DataSource />
      </Rectangle>
    </DataChartComp>
  )
}
export const DataChart = enhancer(DataChartContainer)
