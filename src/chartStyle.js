import { hemelblauw, wit, grijs } from './colors'
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

export const legendLabelPropsFactory = () => ({
  verticalAnchor: 'start',
  dy: -11,
})

const tickLabelStyleFactory = () => ({
  fontSize: 26,
  padding: 8,
  fill: hemelblauw.darker,
})

const xAxisLineTickLabelLineHeight = 1.1

export const xAxisTickLabelPropsFactory = () => {
  const tickLableStyle = tickLabelStyleFactory({})

  return {
    lineHeight: xAxisLineTickLabelLineHeight,
    style: [tickLableStyle, { ...tickLableStyle, fontSize: 22 }],
  }
}

export const yAxisStyleFactory = () => ({
  axis: axisStyle,
  tickLabels: tickLabelStyleFactory(),
  axisLabel: {
    fontSize: 28,
    padding: 100,
    fontWeight: 'bold',
    fill: hemelblauw.darker,
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

export const scatterStyleFactory = ({ color, colorDarker }) => ({
  data: {
    strokeWidth: 4, //eslint-disable-line
    stroke: (data, active) => (active ? colorDarker : color),
    fill: (data, active) => (active ? colorDarker : color),
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
    dimensionLabelStyle
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
