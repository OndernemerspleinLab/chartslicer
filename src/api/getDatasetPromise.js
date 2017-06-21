// @flow
import { omit } from 'lodash/fp'
import { fetchFilteredDataset } from '../api/apiCalls'
import type {
  DatasetId,
  DatasetQuery,
  PeriodType,
  DataEntry,
} from '../store/stateShape'
import type {
  CbsDataEntries,
  CbsDataEntry,
  DataEntriesPromise,
} from './apiShape'
import { convertCbsPeriodToDate } from '../cbsPeriod'

const mapDataEntry = (periodType: PeriodType) => (
  cbsDataEntry: CbsDataEntry
): DataEntry => {
  return {
    id: cbsDataEntry.ID,
    periodType,
    periodDate: convertCbsPeriodToDate(periodType)(cbsDataEntry.Perioden),
    // add topics and dimensions
    ...omit('ID', 'Perioden')(cbsDataEntry),
  }
}

export const getDatasetPromise = ({
  id,
  query,
  periodType,
}: {
  id: DatasetId,
  query: DatasetQuery,
  periodType: PeriodType,
}): DataEntriesPromise =>
  fetchFilteredDataset({
    id,
    query,
  }).then((cbsDataEntries: CbsDataEntries) =>
    cbsDataEntries.map(mapDataEntry(periodType))
  )
