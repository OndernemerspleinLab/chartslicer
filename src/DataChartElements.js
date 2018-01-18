import React from 'react'
import { flatten } from 'lodash/fp'
import { chartPropsFactory } from './chartStyle'
import { pure } from 'recompose'
import { chartTooltipLineLength } from './config'
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
import chroma from 'chroma-js'
import {
	lineStyleFactory,
	areaStyleFactory,
	scatterPropsFactory,
	tooltipScatterStyleFactory,
	tooltipPropsFactory,
	tooltipLabelPropsFactory,
} from './chartStyle'
import { wordBreakIntoArray } from './helpers/stringHelpers'
import { wit } from './colors'

const getStops = ({ min, max, color }) => {
	const beforeCutOffPercentage = max / (max - min) * 100
	const afterCutOffPercentage = 100 - beforeCutOffPercentage
	const maxOpacity = 0.1
	const minOpacity = 0.01
	const maxColor = chroma.mix(wit, color, maxOpacity)
	const minColor = chroma.mix(wit, color, minOpacity)
	const startOffsetRatio = 0.2
	const endOffsetRatio = 0.5
	const stops = [
		{ offset: beforeCutOffPercentage * startOffsetRatio, stopColor: maxColor },
		{ offset: beforeCutOffPercentage * endOffsetRatio, stopColor: minColor },
		{
			offset: 100 - afterCutOffPercentage * endOffsetRatio,
			stopColor: minColor,
		},
		{
			offset: 100 - afterCutOffPercentage * startOffsetRatio,
			stopColor: maxColor,
		},
	]

	return stops
}

const ChartLineGradientComp = ({ color, colorId, min, max }) => {
	const stops = getStops({ min, max, color })
	return (
		<linearGradient id={colorId} x1="0" x2="0" y1="0" y2="1">
			{stops.map(({ offset, stopColor }, index) => {
				return <stop key={index} offset={`${offset}%`} stopColor={stopColor} />
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
	decimals,
}) => {
	const containerComponent = (
		<VictoryVoronoiContainer
			containerId={1}
			voronoiBlacklist={getVoronoiBlacklist(dimensionInfo)}
		/>
	)

	return (
		<VictoryChart
			{...chartPropsFactory({
				globalMax,
				decimals,
			})}
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
			{...scatterPropsFactory({ color, colorDarker, symbol })}
		/>,
	]
}
