import { hemelblauw, wit, grijs } from './colors'
import { chartWidth, chartHeight } from './config'
import { TextSize } from 'victory'
import { formatNumber } from './helpers/helpers'

const fontFamilyProps = {
	fontFamily: 'sans-serif',
	characterConstant: 2.35,
}

const tickLabelStyle = {
	fontSize: 26,
	fill: hemelblauw.darker,
	...fontFamilyProps,
}

const yAxisLabelSpace = 30
const yAxisLabelPadding = 20

const chartLeftPaddingMinimum = 100

const getYAxisLabelOffset = ({ decimals, globalMax }) => {
	const globalMaxFormatted = formatNumber(decimals)(globalMax)
	const { width } = TextSize.approximateTextSize(
		globalMaxFormatted,
		tickLabelStyle,
	)
	return width + yAxisLabelPadding
}

const getChartLeftPadding = ({ decimals, globalMax }) => {
	return Math.max(
		yAxisLabelSpace + getYAxisLabelOffset({ decimals, globalMax }),
		chartLeftPaddingMinimum,
	)
}
// CHART
const chartParentStyle = {
	position: 'absolute',
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
	background: wit,
	border: `1px solid ${hemelblauw.light}`,
}

export const chartPaddingFactory = ({ decimals, globalMax }) => {
	return {
		top: 60,
		left: getChartLeftPadding({
			decimals,
			globalMax,
		}),
		bottom: 110,
		right: 100,
	}
}

const chartYDomainPadding = 40

export const chartPropsFactory = ({ decimals, globalMax }) => ({
	width: chartWidth,
	height: chartHeight,
	style: { parent: chartParentStyle },
	padding: chartPaddingFactory({
		decimals,
		globalMax,
	}),
	domainPadding: {
		y: [chartYDomainPadding, chartYDomainPadding],
		x: [0, 0],
	},
})

// AXIS

const gridStyle = {
	stroke: grijs.light,
	strokeWidth: 1,
}

const axisStyle = {
	stroke: hemelblauw.darker,
	strokeWidth: 1,
}

export const legendPropsFactory = ({ canvasSizeName }) => ({
	orientation: 'horizontal',
	gutter: 22,
	x: 0,
	y: 6,
	symbolSpacer: 12,
	style: {
		labels: {
			fontSize: 22,
			...fontFamilyProps,
		},
	},
})

export const legendLabelPropsFactory = () => ({
	verticalAnchor: 'start',
	dy: -11,
})

const xAxisLineTickLabelLineHeight = 1.1

export const xAxisTickLabelPropsFactory = () => {
	return {
		lineHeight: xAxisLineTickLabelLineHeight,
		style: [tickLabelStyle, { ...tickLabelStyle, fontSize: 22 }],
	}
}

export const yAxisStyleFactory = ({ decimals, globalMax }) => ({
	axis: axisStyle,
	tickLabels: tickLabelStyle,
	axisLabel: {
		fontSize: 28,
		padding: getYAxisLabelOffset({
			decimals,
			globalMax,
		}),
		fontWeight: 'bold',
		fill: hemelblauw.darker,
		...fontFamilyProps,
	},
	grid: gridStyle,
})

export const xAxisStyleFactory = () => ({
	axis: axisStyle,
	grid: gridStyle,
})

// AREA

export const areaStyleFactory = ({ colorId }) => ({
	data: {
		fill: `url(#${colorId})`,
	},
})

// LINE

export const lineStyleFactory = ({ color }) => ({
	data: {
		strokeWidth: 4,
		strokeLinejoin: 'round',
		stroke: color,
	},
})

// SCATTER

export const scatterPropsFactory = ({ color, colorDarker, symbol }) => ({
	size: 6,
	symbol,
	style: {
		data: {
			fill: (data, active) => (active ? colorDarker : color),
		},
	},
})

// TOOLTIP

export const tooltipScatterStyleFactory = ({ color, colorDarker }) => ({
	data: {
		strokeWidth: 0,
		stroke: 'none',
		fill: 'none',
	},
})

const getTooltipOrientation = globalMiddle => ({ y }) => {
	return y < globalMiddle ? 'top' : 'bottom'
}

const getTooltipYDelta = globalMiddle => datum => {
	const { y } = datum

	switch (getTooltipOrientation(globalMiddle)(datum)) {
		case 'bottom':
			// compensate for wrong position when above or on x-axis
			return y >= 0 ? 20 : 0

		case 'top':
			// compensate for wrong position when below x-axis
			return y < 0 ? 20 : 0

		default:
			return 0
	}
}

const tooltipLineHeight = 1.3

const tooltipLabelStyleBase = {
	fontSize: 20,
	...fontFamilyProps,
}

const tooltipLabelStyleFactory = ({
	colorDarker,
	color,
	dimensionLabelLineCount,
}) => {
	const periodStyle = {
		...tooltipLabelStyleBase,
		fontStyle: 'italic',
		fill: colorDarker,
	}
	const unitStyle = {
		...tooltipLabelStyleBase,
		fill: color,
		fontWeight: 'bold',
	}
	const valueStyle = {
		...tooltipLabelStyleBase,
		fontWeight: 'bold',
		fontSize: 32,
		fill: color,
	}
	const dimensionLabelStyle = { ...tooltipLabelStyleBase, fill: colorDarker }
	const dimensionLabelStyleList = Array(dimensionLabelLineCount).fill(
		dimensionLabelStyle,
	)
	const emptyLineStyle = {
		fontSize: 10, // for vertical spacing
	}

	return [
		valueStyle,
		unitStyle,
		emptyLineStyle, // for vertical spacing
		...dimensionLabelStyleList,
		periodStyle,
	]
}

const addTooltipLineHeightToCount = (heightMemo, { fontSize }) => {
	return heightMemo + fontSize * tooltipLineHeight
}

const getTooltipHeight = tooltipLabelStyleList =>
	1.2 * tooltipLabelStyleList.reduce(addTooltipLineHeightToCount, 0)

export const tooltipPropsFactory = ({
	periodDatesInRange,
	canvasSizeName,
	colorDarker,
	color,
	dimensionLabelLineCount,
	globalMiddle,
}) => {
	const tooltipLabelStyleList = tooltipLabelStyleFactory({
		colorDarker,
		color,
		dimensionLabelLineCount,
	})
	const height = getTooltipHeight(tooltipLabelStyleList)

	return {
		height,
		dy: getTooltipYDelta(globalMiddle),
		orientation: getTooltipOrientation(globalMiddle),
		cornerRadius: 1,
		pointerLength: 12,
		pointerWidth: 12,
		flyoutStyle: {
			strokeWidth: 1,
			stroke: colorDarker,
			fill: wit,
		},
		style: tooltipLabelStyleList,
	}
}

export const tooltipLabelPropsFactory = ({
	colorDarker,
	color,
	dimensionLabelLineCount,
}) => {
	const tooltipLabelStyleList = tooltipLabelStyleFactory({
		colorDarker,
		color,
		dimensionLabelLineCount,
	})
	const height = getTooltipHeight(tooltipLabelStyleList)

	return {
		dy: height / 4.4, // to compensate for misplacement op text in flyout
		lineHeight: tooltipLineHeight,
	}
}
