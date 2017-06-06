// @flow

import type { Dimensions, Dimension, DatasetId } from '../store/stateShape'
import type { CbsDimensions, CbsDimension } from './apiShape'
import { set } from '../getset'
import type { CbsDataProperties } from './getCbsDataPropertiesPromise'

const mapDimension = ({ Key, Title, Type }: CbsDimension): Dimension => ({
  key: Key,
  title: Title,
  type: Type,
})
const dimensionReducer = (memo, cbsDimension) =>
  set(cbsDimension.Key, mapDimension(cbsDimension))(memo)

const reduceDimensions = (dimensions: CbsDimensions) =>
  dimensions.reduce(dimensionReducer, {})

export const getDimensions = (id: DatasetId) => ({
  Dimension = [],
  GeoDimension = [],
}: CbsDataProperties): Dimensions => {
  return {
    id,
    ...reduceDimensions([...Dimension, ...GeoDimension]),
  }
}
