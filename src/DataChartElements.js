import React from 'react'
import { VictoryChart, VictoryVoronoiContainer } from 'victory'
import { chartDomainPadding, chartPadding, chartStyle } from './chartStyle'
import { pure } from 'recompose'
import { chartWidth, chartHeight } from './config'

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

export const ChartWrapper = ({
  children,
  containerComponent = <VictoryVoronoiContainer containerId={1} />,
}) => {
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
