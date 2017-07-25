import { addYears, addQuarters, addMonths, format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { rangeNumber } from './helpers/helpers'
import { minPeriodLength, maxPeriodLength } from './config'

const formatDate = (date, formatTemplate) =>
  format(date, formatTemplate, { locale: nlLocale })

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

const cbsPeriodFormatters = {
  Jaar: seperator => date => formatDate(date, 'YYYY'),
  Maanden: seperator => date => formatDate(date, `MMM[${seperator}]YYYY`),
  Kwartalen: seperator => date => formatDate(date, `YYYY[${seperator}][Q]Q`),
}

export const formatCbsPeriod = type => seperator => cbsPeriod =>
  cbsPeriodFormatters[type](seperator)(cbsPeriod)

const cbsPeriodCreators = {
  Jaar: date => formatDate(date, 'YYYY[JJ00]'),
  Maanden: date => formatDate(date, 'YYYY[MM]MM'),
  Kwartalen: date => formatDate(date, 'YYYY[KW0]Q'),
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
