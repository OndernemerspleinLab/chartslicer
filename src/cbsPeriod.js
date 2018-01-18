import { addYears, addQuarters, addMonths, format, isSameYear } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import enLocale from 'date-fns/locale/en'
import { rangeNumber } from './helpers/helpers'
import { minPeriodLength, maxPeriodLength } from './config'
import { previous, last } from './helpers/arrayHelpers'

const locales = {
	nl: nlLocale,
	en: enLocale,
}

const formatDate = ({ date, formatTemplate, language }) =>
	format(date, formatTemplate, { locale: locales[language] })

const splitCbsPeriodString = cbsPeriodString => ({
	year: cbsPeriodString.slice(0, 4),
	part1: cbsPeriodString.slice(4, 6),
	part2: cbsPeriodString.slice(6, 8),
})

const createDate = ({
	year,
	month = 0,
	day = 1,
	hours = 0,
	minutes = 0,
	seconds = 0,
	milliseconds = 0,
}) => new Date(year, month, day, hours, minutes, seconds, milliseconds)

// Convert to zero based
const zeroBased = index => Number(index) - 1

const cbsPeriodMatcher = ({ type, indicator }) => ({ part1 }) =>
	indicator === part1 ? type : undefined

const perYearMatcher = cbsPeriodMatcher({ type: 'Jaar', indicator: 'JJ' })
const perMonthMatcher = cbsPeriodMatcher({ type: 'Maanden', indicator: 'MM' })
const perQuarterMatcher = cbsPeriodMatcher({
	type: 'Kwartalen',
	indicator: 'KW',
})

const periodMatchers = [perYearMatcher, perMonthMatcher, perQuarterMatcher]

export const getCbsPeriodType = cbsPeriodString => {
	const cbsPeriod = splitCbsPeriodString(cbsPeriodString)

	for (let matcher of periodMatchers) {
		const match = matcher(cbsPeriod)

		if (match) {
			return match
		}
	}
}

const cbsPeriodToDateConverters = {
	Jaar: ({ year }) => createDate({ year }),
	Maanden: ({ year, part2 }) => createDate({ year, month: zeroBased(part2) }),
	Kwartalen: ({ year, part2 }) =>
		createDate({ year, month: zeroBased(part2) * 3 }),
}

export const convertCbsPeriodToDate = type => cbsPeriodString => {
	const cbsPeriod = splitCbsPeriodString(cbsPeriodString)

	return cbsPeriodToDateConverters[type](cbsPeriod)
}

const cbsPeriodLabels = {
	nl: {
		Jaar: 'Jaar',
		Maanden: 'Maanden',
		Kwartalen: 'Kwartalen',
	},
	en: {
		Jaar: 'Year',
		Maanden: 'Months',
		Kwartalen: 'Quarters',
	},
}
export const getCbsPeriodLabel = ({ language, periodType }) =>
	cbsPeriodLabels[language][periodType]

export const formatSingleLineCbsPeriod = ({ language, periodType }) => date => {
	switch (periodType) {
		case 'Jaar':
			return formatDate({ date, formatTemplate: 'YYYY', language })
		case 'Maanden':
			return formatDate({ date, formatTemplate: 'MMM YYYY', language })
		case 'Kwartalen':
			return formatDate({ date, formatTemplate: 'YYYY [Q]Q', language })
		default:
			throw new Error(`Invalid periodType : ${periodType}`)
	}
}

export const formatMultiLineCbsPeriod = ({ language, periodType }) => date => {
	switch (periodType) {
		case 'Jaar':
			return formatDate({ date, formatTemplate: 'YYYY', language })
		case 'Maanden':
			return formatDate({ date, formatTemplate: `MMM[\n]YYYY`, language })
		case 'Kwartalen':
			return formatDate({ date, formatTemplate: `[Q]Q[\n]YYYY`, language })
		default:
			throw new Error(`Invalid periodType : ${periodType}`)
	}
}

export const formatShortCbsPeriod = ({ language, periodType }) => date => {
	switch (periodType) {
		case 'Jaar':
			return formatDate({ date, formatTemplate: 'YYYY', language })
		case 'Maanden':
			return formatDate({ date, formatTemplate: `MMM`, language })
		case 'Kwartalen':
			return formatDate({ date, formatTemplate: `[Q]Q`, language })
		default:
			throw new Error(`Invalid periodType : ${periodType}`)
	}
}

const cbsPeriodCreators = {
	Jaar: date => formatDate({ date, formatTemplate: 'YYYY[JJ00]' }),
	Maanden: date => formatDate({ date, formatTemplate: 'YYYY[MM]MM' }),
	Kwartalen: date => formatDate({ date, formatTemplate: 'YYYY[KW0]Q' }),
}

const cbsPeriodAdders = {
	Jaar: amount => date => addYears(date, amount),
	Maanden: amount => date => addMonths(date, amount),
	Kwartalen: amount => date => addQuarters(date, amount),
}

const rangePeriodLength = rangeNumber({
	min: minPeriodLength,
	max: maxPeriodLength,
})

export const createCbsPeriods = ({ endDate, periodType, periodLength }) => {
	const memo = []
	const createCbsPeriod = cbsPeriodCreators[periodType]
	const addCbsPeriods = cbsPeriodAdders[periodType]
	const rangedPeriodLength = rangePeriodLength(periodLength)

	for (let count = -(rangedPeriodLength - 1); count <= 0; count += 1) {
		memo.push(createCbsPeriod(addCbsPeriods(count)(endDate)))
	}

	return memo
}

export const formatWithNewYearFactory = ({ language, periodType }) => {
	if (periodType === 'Jaar') {
		return date => formatMultiLineCbsPeriod({ language, periodType })(date)
	}

	return (date, index, dateList) => {
		const previousDate = previous(index)(dateList)

		if (!previousDate)
			return formatMultiLineCbsPeriod({ language, periodType })(date)

		if (last(dateList) === date)
			return formatMultiLineCbsPeriod({ language, periodType })(date)

		if (!isSameYear(date, previousDate))
			return formatMultiLineCbsPeriod({ language, periodType })(date)

		return formatShortCbsPeriod({ language, periodType })(date)
	}
}
