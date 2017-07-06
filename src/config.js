export const localStorageKey = 'redux/chartslicer'

export const defaultPeriodLength = 10
export const minPeriodLength = 2
export const maxPeriodLength = 300

const breakpoint = 840

export const mqSmall = `@media (max-width: ${breakpoint - 1}px)`
export const mqBig = `@media (min-width: ${breakpoint}px)`

export const chartAspectRatio = 3 / 2
export const chartWidth = 350
export const chartHeight = chartWidth / chartAspectRatio
export const chartMaxWidth = `${100 * chartAspectRatio}vh`

export const sidebarWidth = '25rem'

export const supportedPeriodTypes = ['Jaar', 'Maanden', 'Kwartalen']

export const accordionFromLength = 1
export const rootAccordionFromLength = 3

export const thousandsSeperator = ' '
export const numberSeperator = ','
