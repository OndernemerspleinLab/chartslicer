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
import { chartAspectRatio, chartMaxWidth, chartXAxisTickCount } from './config'
import {
  visibleDatasetEnhancer,
  onlyWhenValidDimension,
} from './enhancers/visibleDatasetEnhancer'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { getIn } from './helpers/getset'
import { connect } from 'react-redux'
import { formatCbsPeriod, formatWithNewYearFactory } from './cbsPeriod'
import { formatNumber, existing, unexisting } from './helpers/helpers'
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
  tooltipScatterStyleFactory,
  tooltipPropsFactory,
  tooltipLineHeight,
  getTooltipXDelta,
  getTooltipYDelta,
  getTooltipOrientation,
} from './chartStyle'

const enhancer = compose(
  onlyWhenVisibleDataset,
  connect(tableLanguageConnector),
  visibleDatasetEnhancer,
  onlyWhenValidDimension
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

const getLegendData = ({ symbol, color, dimensionLabel }) => ({
  name: dimensionLabel,
  symbol: {
    type: symbol,
    fill: color,
  },
})

const getPeriodDate = periodDate => periodDate
const formatTooltipUnit = unit => (existing(unit) ? ` (${unit})` : '')

const Tooltips = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId, symbol },
  periodType,
  unit,
  decimals,
}) => {
  const formatPeriod = formatCbsPeriod(periodType)
  const getValue = periodDate =>
    getIn([dimensionKey, periodDate])(valuesByDimension) || null

  return (
    <VictoryScatter
      key={`tooltipScatter-${colorId}`}
      data={periodDatesInRange.filter(periodDate =>
        existing(getValue(periodDate))
      )}
      x={getPeriodDate}
      y={getValue}
      style={tooltipScatterStyleFactory({ color, colorDarker })}
      symbol={symbol}
      labels={({ x, y }) => {
        if (unexisting(y)) return ''
        return [
          `${formatPeriod(' ')(x)}`,
          `${dimensionLabel}${formatTooltipUnit(unit)}: ${formatNumber(
            decimals
          )(y)}`,
        ]
      }}
      labelComponent={
        <VictoryTooltip
          {...tooltipPropsFactory({ color, colorDarker })}
          labelComponent={<VictoryLabel lineHeight={tooltipLineHeight} />}
          dx={getTooltipXDelta(periodDatesInRange)}
          dy={getTooltipYDelta(periodDatesInRange)}
          orientation={getTooltipOrientation(periodDatesInRange)}
        />
      }
    />
  )
}
const Area = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId },
}) => {
  const getValue = periodDate =>
    getIn([dimensionKey, periodDate])(valuesByDimension) || null
  return (
    <VictoryArea
      key={`area-${colorId}`}
      data={periodDatesInRange}
      x={getPeriodDate}
      y={getValue}
      style={areaStyleFactory({ color, colorId })}
    />
  )
}

const Line = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId, symbol },
}) => {
  const getValue = periodDate =>
    getIn([dimensionKey, periodDate])(valuesByDimension) || null

  return [
    <VictoryLine
      key={`line-${colorId}`}
      data={periodDatesInRange}
      x={getPeriodDate}
      y={getValue}
      style={lineStyleFactory({ color, colorId })}
    />,
    <VictoryScatter
      key={`scatter-${colorId}`}
      data={periodDatesInRange.filter(periodDate =>
        existing(getValue(periodDate))
      )}
      x={getPeriodDate}
      y={getValue}
      style={scatterStyleFactory({ color, colorDarker })}
      symbol={symbol}
    />,
  ]
}

const DataChartContainer = ({
  language,
  periodType,
  dimensionInfo,
  periodDatesInRange,
  valuesByDimension,
  unit,
  decimals,
}) => {
  return (
    <DataChartComp>
      <Rectangle>
        <ChartWrapper>
          {dimensionInfo.map(({ min, max, chartColor }, index) => {
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
            data={dimensionInfo.map(({ dimensionLabel, chartColor }, index) =>
              getLegendData({ dimensionLabel, ...chartColor })
            )}
          />
          <VictoryAxis
            tickValues={periodDatesInRange}
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
          {dimensionInfo.map(singleDimensionInfo =>
            Tooltips({
              ...singleDimensionInfo,
              unit,
              decimals,
              periodType,
              periodDatesInRange,
              valuesByDimension,
            })
          )}
          {dimensionInfo.map(singleDimensionInfo =>
            Area({
              ...singleDimensionInfo,
              unit,
              decimals,
              periodType,
              periodDatesInRange,
              valuesByDimension,
            })
          )}
          {dimensionInfo.map(singleDimensionInfo =>
            Line({
              ...singleDimensionInfo,
              unit,
              decimals,
              periodType,
              periodDatesInRange,
              valuesByDimension,
            })
          )}
        </ChartWrapper>
        <DataSource />
      </Rectangle>
    </DataChartComp>
  )
}
export const DataChart = enhancer(DataChartContainer)
