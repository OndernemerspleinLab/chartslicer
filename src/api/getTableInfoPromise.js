// @flow

import { compose } from 'recompose'
import { supportedPeriodTypes } from './../config'
import { getCbsPeriodType } from '../cbsPeriod'
import { reduce, union, split, intersection } from 'lodash/fp'
import type { DatasetId, TableInfo } from '../store/stateShape'
import { fetchTableInfo, fetchPeriods } from './apiCalls'
import type { CbsTableInfo, CbsPeriods } from './apiShape'
import { get } from '../helpers/getset'

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
]): TableInfo => {
	const periodTypes = getPeriodTypes(cbsPeriods)

	if (periodTypes.length <= 0) {
		throw new Error(
			`No supported period types found in: ${cbsPeriods
				.map(get('Key'))
				.join(',\n')}`,
		)
	}

	return {
		id,
		title: Title,
		description: ShortDescription,
		language: Language,
		graphTypes: split(',')(GraphTypes),
		periodTypes,
	}
}

export const getTableInfoPromise = (id: DatasetId): Promise<TableInfo> =>
	fetchTableInfo(id)
		.then((cbsTableInfo: CbsTableInfo) => {
			return Promise.all([
				cbsTableInfo,
				fetchPeriods({ id, language: cbsTableInfo.Language }),
			])
		})
		.then(mapCbsTableInfo(id))
