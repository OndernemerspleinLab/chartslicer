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
import { visibleDatasetEnhancer } from './enhancers/visibleDatasetEnhancer'
import {
	onlyWhenDataAvailable,
	onlyWhenVisibleDataset,
} from './enhancers/datasetGuardEnhancer'
import { connect } from 'react-redux'
import { formatWithNewYearFactory } from './cbsPeriod'
import { formatNumber } from './helpers/helpers'
import { DataSource } from './DataSource'
import {
	ChartWrapper,
	ChartLineGradient,
	Tooltips,
	Area,
	Line,
} from './DataChartElements'
import {
	xAxisStyleFactory,
	yAxisStyleFactory,
	legendPropsFactory,
	legendLabelPropsFactory,
	xAxisTickLabelPropsFactory,
} from './chartStyle'
import { wordBreak } from './helpers/stringHelpers'
import { environmentLanguageConnector } from './connectors/environmentLanguageConnectors'

const enhancer = compose(
	onlyWhenVisibleDataset,
	connect(environmentLanguageConnector),
	visibleDatasetEnhancer,
	onlyWhenDataAvailable,
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
	environmentLanguage,
	periodType,
	dimensionInfo,
	periodDatesInRange,
	valuesByDimension,
	unit,
	decimals,
	globalMiddle,
	globalMax,
	globalMin,
}) => {
	return (
		<DataChartComp>
			<Rectangle>
				<ChartWrapper
					dimensionInfo={dimensionInfo}
					unit={unit}
					decimals={decimals}
					periodType={periodType}
					globalMax={globalMax}
					globalMin={globalMin}
					language={environmentLanguage}
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
					{dimensionInfo.map(singleDimensionInfo =>
						Tooltips({
							...singleDimensionInfo,
							unit,
							decimals,
							periodType,
							periodDatesInRange,
							valuesByDimension,
							globalMiddle,
							language: environmentLanguage,
						}),
					)}
					{dimensionInfo.map(singleDimensionInfo =>
						Area({
							...singleDimensionInfo,
							unit,
							decimals,
							periodType,
							periodDatesInRange,
							valuesByDimension,
						}),
					)}
					<VictoryAxis
						tickValues={periodDatesInRange}
						tickFormat={formatWithNewYearFactory({
							language: environmentLanguage,
							periodType,
						})}
						scale="time"
						style={xAxisStyleFactory({})}
						tickCount={chartXAxisTickCount}
						tickLabelComponent={
							<VictoryLabel {...xAxisTickLabelPropsFactory({})} />
						}
					/>
					<VictoryAxis
						dependentAxis
						label={unit}
						tickFormat={formatNumber({
							language: environmentLanguage,
							decimals,
						})}
						style={yAxisStyleFactory({
							decimals,
							globalMax,
							globalMin,
						})}
					/>
					{dimensionInfo.map(singleDimensionInfo =>
						Line({
							...singleDimensionInfo,
							unit,
							decimals,
							periodType,
							periodDatesInRange,
							valuesByDimension,
						}),
					)}
					<VictoryLegend
						{...legendPropsFactory({})}
						data={dimensionInfo.map(({ dimensionLabel, chartColor }) =>
							getLegendData({ dimensionLabel, ...chartColor }),
						)}
						labelComponent={<VictoryLabel {...legendLabelPropsFactory({})} />}
					/>
				</ChartWrapper>
				<DataSource />
			</Rectangle>
		</DataChartComp>
	)
}
export const DataChart = enhancer(DataChartContainer)
