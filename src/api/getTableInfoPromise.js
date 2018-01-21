// @flow

import { compose } from 'recompose'
import { supportedPeriodTypes } from './../config'
import { getCbsPeriodType } from '../cbsPeriod'
import { reduce, union, split, intersection } from 'lodash/fp'
import type { DatasetId, TableInfo } from '../store/stateShape'
import { fetchTableInfo, fetchPeriods } from './apiCalls'
import type { CbsTableInfo, CbsPeriods } from './apiShape'

const onlySupportedPeriodTypes = intersection(supportedPeriodTypes)

const getPeriodTypes = compose(
	onlySupportedPeriodTypes,
	reduce(
		(periodTypes, { Key }) => union([getCbsPeriodType(Key)])(periodTypes),
		[],
	),
)

const mapCbsTableInfo = (id: DatasetId) => ([
	{ Title, GraphTypes, ShortDescription, Language }: CbsTableInfo,
	cbsPeriods: CbsPeriods,
]): TableInfo => ({
	id,
	title: Title,
	description: ShortDescription,
	language: Language,
	graphTypes: split(',')(GraphTypes),
	periodTypes: getPeriodTypes(cbsPeriods),
})

export const getTableInfoPromise = (id: DatasetId): Promise<TableInfo> =>
	fetchTableInfo(id)
		.then((cbsTableInfo: CbsTableInfo) => {
			return Promise.all([
				cbsTableInfo,
				fetchPeriods({ id, language: cbsTableInfo.Language }),
			])
		})
		.then(mapCbsTableInfo(id))
