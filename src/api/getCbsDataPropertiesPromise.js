// @flow

import type { DatasetId } from '../store/stateShape'
import { groupBy } from 'lodash/fp'
import { fetchDataProperties } from './apiCalls'
import type { CbsTopic, CbsTopicGroup, CbsDimension } from './apiShape'

const groupByType = groupBy(({ Type }) => Type)

export type CbsDataProperties = {
	Topic: CbsTopic[],
	TopicGroup: CbsTopicGroup[],
	Dimension: CbsDimension[],
	GeoDimension: CbsDimension[],
}

export type CbsDataPropertiesPromise = Promise<CbsDataProperties>

// Fetches Dimensions, TopicGroups and Topics
export const getCbsDataPropertiesPromise = (
	id: DatasetId,
): CbsDataPropertiesPromise => fetchDataProperties(id).then(groupByType)
