// @flow

import { getCbsPeriodType } from '../cbsPeriod'
import { reduce, union, split } from 'lodash/fp'
import type { DatasetId, TableInfo } from '../store/stateShape'
import { fetchTableInfo, fetchPeriods } from './apiCalls'
import type { CbsTableInfo, CbsPeriods } from './apiShape'

const getPeriodTypes = reduce(
  (periodTypes, { Key }) => union([getCbsPeriodType(Key)])(periodTypes),
  []
)

const mapCbsTableInfo = (id: DatasetId) => (
  [{ Title, GraphTypes }: CbsTableInfo, cbsPeriods: CbsPeriods]
): TableInfo => ({
  id,
  title: Title,
  graphTypes: split(',')(GraphTypes),
  periodTypes: getPeriodTypes(cbsPeriods),
})

export const getTableInfoPromise = (id: DatasetId): Promise<TableInfo> =>
  Promise.all([fetchTableInfo(id), fetchPeriods(id)]).then(mapCbsTableInfo(id))
