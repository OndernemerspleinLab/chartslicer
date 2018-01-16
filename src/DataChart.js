import React from 'react'
import { compose } from 'recompose'
import { VictoryLabel, VictoryLegend, VictoryAxis } from 'victory'
import glamorous from 'glamorous'
import { fadeInAnimation } from './styles'
import {
  chartAspectRatio,
  chartMaxWidth,
  chartXAxisTickCount,
  chartLegendLineLength,
} from './config'
import {
  visibleDatasetEnhancer,
  onlyWhenValidDimension,
} from './enhancers/visibleDatasetEnhancer'
import { onlyWhenVisibleDataset } from './enhancers/datasetEnhancer'
import { connect } from 'react-redux'
import { formatWithNewYearFactory } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { DataSource } from './DataSource'
import { tableLanguageConnector } from './connectors/tableInfoConnectors'
import {
  ChartWrapper,
  ChartLineGradient,
  Tooltips,
  Area,
  Line,
} from './DataChartElements'
import {
  xAxisStyleFactory,
  xAxisLineTickLabelLineHeight,
  yAxisStyleFactory,
  legendPropsFactory,
  legendLabelPropsFactory,
} from './chartStyle'
import { wordBreak } from './helpers/stringHelpers'

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
  name: wordBreak({
    lineLength: chartLegendLineLength,
    sentence: dimensionLabel,
  }),
  symbol: {
    type: symbol,
    fill: color,
  },
})

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
        <ChartWrapper
          dimensionInfo={dimensionInfo}
          unit={unit}
          decimals={decimals}
          periodType={periodType}
        >
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
            data={dimensionInfo.map(({ dimensionLabel, chartColor }) =>
              getLegendData({ dimensionLabel, ...chartColor })
            )}
            labelComponent={<VictoryLabel {...legendLabelPropsFactory({})} />}
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
