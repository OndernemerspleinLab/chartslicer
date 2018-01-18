import React from 'react'
import { flatten } from 'lodash/fp'
import { chartDomainPadding, chartPadding, chartStyle } from './chartStyle'
import { pure } from 'recompose'
import { chartWidth, chartHeight, chartTooltipLineLength } from './config'
import {
	VictoryArea,
	VictoryLine,
	VictoryScatter,
	VictoryTooltip,
	VictoryLabel,
	VictoryChart,
	VictoryVoronoiContainer,
} from 'victory'
import { formatSingleLineCbsPeriod } from './cbsPeriod'
import { formatNumber, existing, unexisting } from './helpers/helpers'
import {
	lineStyleFactory,
	areaStyleFactory,
	scatterStyleFactory,
	tooltipScatterStyleFactory,
	tooltipPropsFactory,
	tooltipLabelPropsFactory,
} from './chartStyle'
import { wordBreakIntoArray } from './helpers/stringHelpers'

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
		]),
	)
export const ChartWrapper = ({
	children,
	dimensionInfo,
	globalMax,
	globalMin,
}) => {
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
			domain={{ y: [globalMin, globalMax] }}
		>
			{children}
		</VictoryChart>
	)
}

const formatTooltipUnit = unit => (existing(unit) ? ` (${unit})` : '')

export const Tooltips = ({
	periodDatesInRange,
	valuesByDimension,
	dimensionKey,
	dimensionLabel,
	filteredDimensionData,
	chartColor: { color, colorDarker, colorId, symbol },
	periodType,
	unit,
	decimals,
	globalMiddle,
	language,
}) => {
	const formatPeriod = formatSingleLineCbsPeriod({ periodType, language })

	const dimensionLabelBrokenIntoArray = wordBreakIntoArray({
		lineLength: chartTooltipLineLength,
		sentence: dimensionLabel,
	})
	const formattedUnit = formatTooltipUnit(unit)
	const dimensionLabelLineCount = dimensionLabelBrokenIntoArray.length

	return (
		<VictoryScatter
			name={`tooltipScatter-${colorId}`}
			key={`tooltipScatter-${colorId}`}
			data={filteredDimensionData}
			style={tooltipScatterStyleFactory({ color, colorDarker })}
			symbol={symbol}
			labels={({ x, y }) => {
				if (unexisting(y)) return ''
				return [
					formatNumber(decimals)(y),
					formattedUnit,
					' ', // empty line for vertical spacing
					...dimensionLabelBrokenIntoArray,
					formatPeriod(x),
				]
			}}
			labelComponent={
				<VictoryTooltip
					{...tooltipPropsFactory({
						color,
						colorDarker,
						periodDatesInRange,
						dimensionLabelLineCount,
						globalMiddle,
					})}
					labelComponent={
						<VictoryLabel
							{...tooltipLabelPropsFactory({
								color,
								colorDarker,
								dimensionLabelLineCount,
							})}
						/>
					}
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
	dimensionData,
	chartColor: { color, colorDarker, colorId },
}) => {
	return (
		<VictoryArea
			name={`area-${colorId}`}
			key={`area-${colorId}`}
			data={dimensionData}
			style={areaStyleFactory({ color, colorId })}
		/>
	)
}

export const Line = ({
	periodDatesInRange,
	valuesByDimension,
	dimensionKey,
	dimensionLabel,
	dimensionData,
	filteredDimensionData,
	chartColor: { color, colorDarker, colorId, symbol },
	unit,
	decimals,
}) => {
	return [
		<VictoryLine
			name={`line-${colorId}`}
			key={`line-${colorId}`}
			data={dimensionData}
			style={lineStyleFactory({ color, colorId })}
		/>,
		<VictoryScatter
			name={`scatter-${colorId}`}
			key={`scatter-${colorId}`}
			data={filteredDimensionData}
			style={scatterStyleFactory({ color, colorDarker })}
			symbol={symbol}
		/>,
	]
}
