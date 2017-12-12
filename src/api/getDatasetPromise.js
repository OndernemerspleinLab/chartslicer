// @flow
import { pick } from 'lodash/fp'
import { fetchFilteredDataset } from '../api/apiCalls'
import type {
  DatasetId,
  DatasetQuery,
  PeriodType,
  DataEntry,
  TopicKey,
  CategoryKeys,
  MultiDimensionSetting,
} from '../store/stateShape'
import type {
  CbsDataEntries,
  CbsDataEntry,
  DataEntriesPromise,
} from './apiShape'
import { convertCbsPeriodToDate } from '../cbsPeriod'

const mapDataEntry = ({
  periodType,
  topicKeys = [],
  categoryKeys = {},
}: {
  periodType: PeriodType,
  topicKeys: TopicKey[],
  categoryKeys: CategoryKeys,
}) => (cbsDataEntry: CbsDataEntry): DataEntry => {
  return {
    id: cbsDataEntry.ID,
    periodType,
    periodDate: convertCbsPeriodToDate(periodType)(
      cbsDataEntry.Perioden || cbsDataEntry.Periods
    ),
    // add topics and dimensions
    ...pick(topicKeys)(cbsDataEntry),
    ...pick(Object.keys(categoryKeys))(cbsDataEntry),
  }
}

export const getDatasetPromise = ({
  id,
  query,
  periodType,
  topicKeys,
  multiDimension,
  categoryKeys,
}: {
  id: DatasetId,
  query: DatasetQuery,
  periodType: PeriodType,
  topicKeys: TopicKey[],
  categoryKeys: CategoryKeys,
  multiDimension: MultiDimensionSetting,
}): DataEntriesPromise =>
  fetchFilteredDataset({
    id,
    query,
  }).then((cbsDataEntries: CbsDataEntries) =>
    cbsDataEntries.map(mapDataEntry({ periodType, categoryKeys, topicKeys }))
  )
