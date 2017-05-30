import {
  addYears,
  addMonths,
  endOfYear,
  endOfMonth,
  endOfDay,
  format,
} from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

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
const regexMatcher = regex => ({ part1 }) => regex.test(part1)
const stringMatcher = string => ({ part1 }) => string === part1

// All supported cbsPeriods
const cbsPeriodTypes = [
  {
    match: regexMatcher(/^\d\d$/),
    type: 'Dagen',
    parse: ({ year, part1, part2 }) => {
      const startDate = createDate({
        year,
        month: zeroBased(part1),
        day: part2,
      })
      const endDate = endOfDay(startDate)
      return {
        type: 'Dagen',
        startDate,
        endDate,
        format: () => formatDate(startDate, 'D MMM YYYY'),
      }
    },
  },
  {
    match: stringMatcher('JJ'),
    type: 'Jaar',
    parse: ({ year }) => {
      const startDate = createDate({ year })
      const endDate = endOfYear(startDate)
      return {
        type: 'Jaar',
        startDate,
        endDate,
        format: () => formatDate(startDate, 'YYYY'),
      }
    },
  },
  {
    match: stringMatcher('MM'),
    type: 'Maanden',
    parse: ({ year, part2 }) => {
      const startDate = createDate({ year, month: zeroBased(part2) })
      const endDate = endOfMonth(startDate)
      return {
        type: 'Maanden',
        startDate,
        endDate,
        format: () => formatDate(startDate, 'MMM YYYY'),
      }
    },
  },
  {
    match: stringMatcher('KW'),
    type: 'Kwartalen',
    parse: ({ year, part2 }) => {
      const startDate = createDate({ year, month: zeroBased(part2) * 3 })
      const endDate = endOfMonth(addMonths(startDate, 2)) // End of month adds the third month of the quarter
      return {
        type: 'Kwartalen',
        startDate,
        endDate,
        format: () => formatDate(startDate, 'YYYY [Q]Q'),
      }
    },
  },
  {
    match: stringMatcher('SJ'),
    type: 'School-, Bouw-, Oogstjaar',
    parse: ({ year }) => {
      const startDate = createDate({ year, month: 7, day: 1 })
      const endDate = endOfMonth(addYears(createDate({ year, month: 6 }), 1))
      return {
        type: 'School-, Bouw-, Oogstjaar',
        startDate,
        endDate,
        format: () =>
          `${formatDate(startDate, 'YYYY')}/${formatDate(endDate, 'YYYY')}`,
      }
    },
  },
  {
    match: stringMatcher('HJ'),
    type: 'Half jaar',
    parse: ({ year, part2 }) => {
      const startMonth = zeroBased(part2) * 6
      const startDate = createDate({ year, month: startMonth })
      const endDate = endOfMonth(addMonths(startDate, 6))

      return {
        type: 'Half jaar',
        startDate,
        endDate,
        format: () =>
          `${formatDate(startDate, 'YYYY')} ${part2 === '01' ? 'eerste helft' : 'tweede helft'}`,
      }
    },
  },
  {
    match: stringMatcher('W1'),
    parse: ({ year, part2 }) => {
      throw new Error('cbsPeriod type “Week, systeem 1” is not yet implemented')
    },
  },
  {
    match: stringMatcher('W4'),
    type: 'Week, vier weken',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “Week, vier weken” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('VS'),
    type: 'Voorschijdende maanden',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “Voorschijdende maanden” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('G2'),
    type: '2-jaarsgemiddelde',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “2-jaarsgemiddelde” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('G3'),
    type: '3-jaarsgemiddelde',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “3-jaarsgemiddelde” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('G4'),
    type: '4-jaarsgemiddelde',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “4-jaarsgemiddelde” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('G5'),
    type: '5-jaarsgemiddelde',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “5-jaarsgemiddelde” is not yet implemented'
      )
    },
  },
  {
    match: regexMatcher(/^X.$/),
    type: 'Geen officiële periode indeling',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “Geen officiële periode indeling” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('VJ'),
    type: 'Voortschrijdend jaar',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “Voortschrijdend jaar” is not yet implemented'
      )
    },
  },
  {
    match: stringMatcher('M3'),
    type: '3 maandelijks gemiddelde',
    parse: ({ year, part2 }) => {
      throw new Error(
        'cbsPeriod type “3 maandelijks gemiddelde” is not yet implemented'
      )
    },
  },
]

export const getCbsPeriodType = cbsPeriodString => {
  const cbsPeriod = splitCbsPeriodString(cbsPeriodString)

  const { type } = cbsPeriodTypes.find(({ match }) => match(cbsPeriod)) || {}

  return type
}
export const parseCbsPeriod = cbsPeriodString => {
  const cbsPeriod = splitCbsPeriodString(cbsPeriodString)

  const { parse } = cbsPeriodTypes.find(({ match }) => match(cbsPeriod))

  return parse(cbsPeriod)
}
