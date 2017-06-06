// @flow

import type { DatasetId, DimensionKey } from '../store/stateShape'
import { zipObject } from 'lodash/fp'
import { fetchCategory } from './apiCalls'
import type { CbsDimensions, CbsCategories } from './apiShape'
import type { CbsDataProperties } from './getCbsDataPropertiesPromise'

export type CbsCategoriesByDimension = {
  [DimensionKey]: CbsCategories,
}
export type CbsCategoriesByDimensionPromise = Promise<CbsCategoriesByDimension>

// Fetches all CategoryGroups
const getCategoriesPromise = ({
  id,
  cbsDimensions,
}: {
  id: DatasetId,
  cbsDimensions: CbsDimensions,
}) => {
  const dimensionKeys = cbsDimensions.map(({ Key }) => Key)

  return Promise.all(
    dimensionKeys.map(fetchCategory(id))
  ).then(cbsCategories => {
    return zipObject(dimensionKeys, cbsCategories)
  })
}

// Fetches Dimensions, TopicGroups and Topics
export const getCbsCategorieByDimensionPromise = (id: DatasetId) => ({
  Dimension = [],
  GeoDimension = [],
}: CbsDataProperties): CbsCategoriesByDimensionPromise =>
  getCategoriesPromise({ id, cbsDimensions: [...Dimension, ...GeoDimension] })
