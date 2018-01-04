import { visibleDataInfoConnector } from './visibleDataInfoEnhancer'
import { fill, pick } from 'lodash/fp'
import { connect } from 'react-redux'
import { compareAsc, isEqual } from 'date-fns'
import { get, set } from '../helpers/getset'

const getDate = get('periodDate')

const equalDateToEntry = date => ({ periodDate }) => isEqual(date, periodDate)

const dataEntryReducer = ({ column, columnCount }) => (
  memo,
  { id, periodDate, periodType, value }
) => {
  const oldEntryIndex = memo.findIndex(equalDateToEntry(periodDate))
  const oldEntry =
    oldEntryIndex >= 0
      ? memo[oldEntryIndex]
      : {
          periodDate,
          periodType,
        }

  const {
    values = fill(undefined, undefined, undefined)(Array(columnCount)),
  } = oldEntry
  const newValues = values.slice()
  newValues[column] = value

  const newEntry = set('values', newValues)(oldEntry)

  if (oldEntryIndex >= 0) {
    memo[oldEntryIndex] = newEntry
  } else {
    memo.push(newEntry)
  }

  return memo
}

const convertDataGroupsListToTable = ({ dataGroupsList }) => {
  const titles = dataGroupsList.map(pick(['info', 'type', 'title']))
  const columnCount = dataGroupsList.length
  const dataEntryLists = dataGroupsList.map(get('dataEntryList'))

  const tableRowsUnsorted = dataEntryLists.reduce(
    (memo, dataEntryList, column) => {
      return dataEntryList.reduce(
        dataEntryReducer({ column, columnCount }),
        memo
      )
    },
    []
  )

  const tableRows = tableRowsUnsorted.sort((tableRow1, tableRow2) =>
    compareAsc(getDate(tableRow1), getDate(tableRow2))
  )

  console.log('titles', titles)
  console.log('tableRows', tableRows)

  return { titles, columnCount, tableRows }
}

const visibleDataAsTableConnector = state => {
  const visibleDatasetInfo = visibleDataInfoConnector(state)

  return {
    ...visibleDatasetInfo,
    ...convertDataGroupsListToTable(visibleDatasetInfo),
  }
}

export const visibleDataAsTableEnhancer = connect(visibleDataAsTableConnector)
