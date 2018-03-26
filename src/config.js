import { mosgroen, hemelblauw, violet } from './colors'
export const localStorageKey = 'redux/chartslicer'

export const maxDimensions = 3
export const defaultPeriodLength = 10
export const minPeriodLength = 2
export const maxPeriodLength = 300

const breakpoint = 840

export const mqSmall = `@media (max-width: ${breakpoint - 1}px)`
export const mqBig = `@media (min-width: ${breakpoint}px)`

export const chartAspectRatio = 1.5
export const chartWidth = 930
export const chartHeight = chartWidth / chartAspectRatio
export const chartMaxWidth = `${100 * chartAspectRatio}vh`
export const chartXAxisTickCount = 6
export const chartLegendLineLength = 25
export const chartTooltipLineLength = 15

export const sidebarWidth = '25rem'

export const supportedPeriodTypes = ['Jaar', 'Maanden', 'Kwartalen']

export const accordionFromLength = 1
export const rootAccordionFromLength = 3

export const thousandsSeperator = ' '
export const getDecimalSeperator = language => {
	switch (language) {
		case 'en':
			return '.'
		case 'nl':
		default:
			return ','
	}
}

export const defaultLanguage = 'nl'
export const supportedLanguages = [defaultLanguage, 'en']

export const getStatLineUrl = lang => `https://opendata.cbs.nl/#/CBS/${lang}/`

export const DIMENSION_TOPIC = 'DIMENSION_TOPIC'

export const chartColors = [
	{
		color: hemelblauw.default,
		colorDarker: hemelblauw.darker,
		colorId: 'gradient-hemelblauw',
		symbol: 'circle',
	},
	{
		color: violet.default,
		colorDarker: violet.darker,
		colorId: 'gradient-violet',
		symbol: 'diamond',
	},
	{
		color: mosgroen.default,
		colorDarker: mosgroen.darker,
		colorId: 'gradient-mosgroen',
		symbol: 'square',
	},
]
