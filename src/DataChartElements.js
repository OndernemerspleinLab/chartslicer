import React from 'react'
import { flatten } from 'lodash/fp'
import { chartDomainPadding, chartPadding, chartStyle } from './chartStyle'
import { pure } from 'recompose'
import { chartWidth, chartHeight } from './config'
import {
  VictoryArea,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryLabel,
  VictoryChart,
  VictoryVoronoiContainer,
} from 'victory'
import { getIn } from './helpers/getset'
import { formatSingleLineCbsPeriod } from './cbsPeriod'
import { formatNumber, existing, unexisting } from './helpers/helpers'
import {
  lineStyleFactory,
  areaStyleFactory,
  scatterStyleFactory,
  tooltipScatterStyleFactory,
  tooltipPropsFactory,
  tooltipLineHeight,
} from './chartStyle'

const getStops = ({ min, max }) => {
  const cutoffPercentage = max / (max - min) * 100
  const maxOpacity = 0.15
  const minOpacity = 0.02
  const startOffsetRatio = 0.2
  const endOffsetRatio = 0.5
  const stops = [
    { offset: cutoffPercentage * startOffsetRatio, opacity: maxOpacity },
    { offset: cutoffPercentage * endOffsetRatio, opacity: minOpacity },
    {
      offset: 100 - (100 - cutoffPercentage) * endOffsetRatio,
      opacity: minOpacity,
    },
    {
      offset: 100 - (100 - cutoffPercentage) * startOffsetRatio,
      opacity: maxOpacity,
    },
  ]

  return stops
}

const ChartLineGradientComp = ({ color, colorId, min, max }) => {
  const stops = getStops({ min, max })
  return (
    <linearGradient id={colorId} x1="0" x2="0" y1="0" y2="1">
      {stops.map(({ offset, opacity }, index) => {
        return (
          <stop
            key={index}
            offset={`${offset}%`}
            stopColor={color}
            stopOpacity={opacity}
          />
        )
      })}
    </linearGradient>
  )
}

export const ChartLineGradient = pure(ChartLineGradientComp)

const getVoronoiBlacklist = dimensionInfo =>
  flatten(
    dimensionInfo.map(({ chartColor: { colorId } }) => [
      `scatter-${colorId}`,
      `area-${colorId}`,
      `line-${colorId}`,
    ])
  )
export const ChartWrapper = ({ children, dimensionInfo }) => {
  const containerComponent = (
    <VictoryVoronoiContainer
      containerId={1}
      voronoiBlacklist={getVoronoiBlacklist(dimensionInfo)}
    />
  )
  return (
    <VictoryChart
      width={chartWidth}
      height={chartHeight}
      style={chartStyle}
      padding={chartPadding}
      domainPadding={chartDomainPadding}
      containerComponent={containerComponent}
    >
      {children}
    </VictoryChart>
  )
}

const getPeriodDate = periodDate => periodDate

const getValueFactory = ({ dimensionKey, valuesByDimension }) => periodDate => {
  const value = getIn([dimensionKey, periodDate])(valuesByDimension)

  return existing(value) ? value : null
}

const formatTooltipUnit = unit => (existing(unit) ? ` (${unit})` : '')

export const Tooltips = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId, symbol },
  periodType,
  unit,
  decimals,
}) => {
  const formatPeriod = formatSingleLineCbsPeriod(periodType)
  const getValue = getValueFactory({
    dimensionKey,
    valuesByDimension,
  })

  return (
    <VictoryScatter
      name={`tooltipScatter-${colorId}`}
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
          `${formatPeriod(x)}`,
          `${dimensionLabel}${formatTooltipUnit(unit)}: ${formatNumber(
            decimals
          )(y)}`,
        ]
      }}
      labelComponent={
        <VictoryTooltip
          {...tooltipPropsFactory({ periodDatesInRange, color, colorDarker })}
          labelComponent={<VictoryLabel lineHeight={tooltipLineHeight} />}
        />
      }
    />
  )
}

export const Area = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId },
}) => {
  const getValue = getValueFactory({
    dimensionKey,
    valuesByDimension,
  })

  return (
    <VictoryArea
      name={`area-${colorId}`}
      key={`area-${colorId}`}
      data={periodDatesInRange}
      x={getPeriodDate}
      y={getValue}
      style={areaStyleFactory({ color, colorId })}
    />
  )
}

export const Line = ({
  periodDatesInRange,
  valuesByDimension,
  dimensionKey,
  dimensionLabel,
  chartColor: { color, colorDarker, colorId, symbol },
  unit,
  decimals,
}) => {
  const getValue = getValueFactory({
    dimensionKey,
    valuesByDimension,
  })

  return [
    <VictoryLine
      name={`line-${colorId}`}
      key={`line-${colorId}`}
      data={periodDatesInRange}
      x={getPeriodDate}
      y={getValue}
      style={lineStyleFactory({ color, colorId })}
    />,
    <VictoryScatter
      name={`scatter-${colorId}`}
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
