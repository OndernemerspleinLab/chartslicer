// @flow
import { reduce } from 'lodash/fp'
import type {
  Categories,
  Category,
  DatasetId,
  DimensionKey,
} from '../store/stateShape'
import type { CbsCategoriesByDimension } from './getCbsCategoriesByDimensionPromise'
import type { CbsCategory, CbsCategories } from './apiShape'
import { set } from '../getset'

const mapCategory = (dimensionKey: DimensionKey) => ({
  Key,
  Title,
}: CbsCategory): Category => ({
  dimensionKey: dimensionKey,
  key: Key,
  title: Title,
})
const categoriesForDimensionReducer = dimensionKey => (memo, cbsCategory) =>
  set(cbsCategory.Key, mapCategory(dimensionKey)(cbsCategory))(memo)

const reduceCategoriesForDimension = (
  memo,
  [dimensionKey, cbsCategoriesByDimension]: [DimensionKey, CbsCategories]
) => {
  return set(
    dimensionKey,
    cbsCategoriesByDimension.reduce(
      categoriesForDimensionReducer(dimensionKey),
      {}
    )
  )(memo)
}
const reduceCbsCategoriesByDimension = cbsCategoriesByDimension =>
  reduce(reduceCategoriesForDimension, {})(
    Object.entries(cbsCategoriesByDimension)
  )

export const getCategories = (id: DatasetId) => (
  cbsCategoriesByDimension: CbsCategoriesByDimension
): Categories => {
  return {
    id,
    ...reduceCbsCategoriesByDimension(cbsCategoriesByDimension),
  }
}
