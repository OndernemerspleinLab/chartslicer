// @flow
import { omit } from 'lodash/fp'
import { fetchFilteredDataset } from '../api/apiCalls'
import type {
  DatasetId,
  DatasetQuery,
  PeriodType,
  DataEntry,
  TopicKey,
} from '../store/stateShape'
import type {
  CbsDataEntries,
  CbsDataEntry,
  DataEntriesPromise,
} from './apiShape'
import { convertCbsPeriodToDate } from '../cbsPeriod'
import { existing } from '../helpers/helpers'

const mapDataEntry = (periodType: PeriodType) => (
  cbsDataEntry: CbsDataEntry
): DataEntry => {
  return {
    id: cbsDataEntry.ID,
    periodType,
    periodDate: convertCbsPeriodToDate(periodType)(cbsDataEntry.Perioden),
    // add topics and dimensions
    ...omit(['ID', 'Perioden'])(cbsDataEntry),
  }
}

export const getDatasetPromise = ({
  id,
  query,
  periodType,
  topicKey,
}: {
  id: DatasetId,
  query: DatasetQuery,
  periodType: PeriodType,
  topicKey: TopicKey,
}): DataEntriesPromise =>
  fetchFilteredDataset({
    id,
    query,
  }).then((cbsDataEntries: CbsDataEntries) =>
    cbsDataEntries
      .map(mapDataEntry(periodType))
      .filter(dataEntry => existing(dataEntry[topicKey]))
  )
