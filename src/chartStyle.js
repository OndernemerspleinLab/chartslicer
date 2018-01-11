import { hemelblauw, wit, grijs } from './colors'
import { first, last } from './helpers/arrayHelpers'
import { get } from './helpers/getset'

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

export const chartStyle = { parent: chartParentStyle }
const chartYDomainPadding = 40
export const chartDomainPadding = {
  y: [chartYDomainPadding, chartYDomainPadding],
  x: [0, 0],
}
export const chartPadding = {
  top: 60,
  left: 130,
  bottom: 110,
  right: 100,
}

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
    },
  },
})

const tickLabelStyleFactory = () => ({
  fontSize: 26,
  padding: 8,
  fill: hemelblauw.darker,
  fontFamily: 'RijksSans, tahoma, sans-serif',
})

export const xAxisLineTickLabelLineHeight = 1
export const tooltipLineHeight = 1.2

export const yAxisStyleFactory = () => ({
  axis: axisStyle,
  tickLabels: tickLabelStyleFactory(),
  axisLabel: {
    fontSize: 28,
    padding: 100,
    fontWeight: 'bold',
    fill: hemelblauw.darker,
    fontFamily: 'RijksSans, tahoma, sans-serif',
  },
  grid: gridStyle,
})

export const xAxisStyleFactory = () => ({
  axis: axisStyle,
  tickLabels: tickLabelStyleFactory(),
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

export const scatterStyleFactory = ({ color, colorDarker }) => ({
  data: {
    strokeWidth: 4, //eslint-disable-line
    stroke: (data, active) => (active ? colorDarker : color),
    fill: (data, active) => (active ? colorDarker : color),
  },
})

// TOOLTIP

const getPeriodDate = dataEntry => get('periodDate')(dataEntry)

export const getTooltipOrientation = dataEntryList => ({ x }) => {
  if (getPeriodDate(first(dataEntryList)) === x) return 'right'

  if (getPeriodDate(last(dataEntryList)) === x) return 'left'

  return 'top'
}

export const getTooltipXDelta = dataEntryList => coordinate => {
  switch (getTooltipOrientation(dataEntryList)(coordinate)) {
    case 'left':
    case 'right':
      return 8

    case 'top':
    default:
      return 0
  }
}

export const getTooltipYDelta = dataEntryList => coordinate => {
  switch (getTooltipOrientation(dataEntryList)(coordinate)) {
    case 'left':
    case 'right':
      return coordinate.y < 0 ? 10 : -10

    case 'top':
    default:
      return coordinate.y < 0 ? 20 : 0
  }
}

export const tooltipPropsFactory = ({ canvasSizeName, colorDarker }) => ({
  cornerRadius: 1,
  pointerLength: 12,
  pointerWidth: 12,
  style: {
    fontSize: 24,
    fill: colorDarker,
    fontFamily: 'RijksSans, tahoma, sans-serif',
  },
  flyoutStyle: {
    strokeWidth: 2,
    stroke: colorDarker,
    fill: wit,
  },
})
