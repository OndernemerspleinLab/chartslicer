// @flow
import { groupBy, reduce, pickBy } from 'lodash/fp'
import type {
  DatasetId,
  DimensionKey,
  CategoryGroups,
  CategoryGroup,
} from '../store/stateShape'
import type {
  CbsCategoryGroups,
  CbsCategoryGroup,
  CbsCategories,
} from './apiShape'
import { set, get } from '../helpers/getset'
import type { CbsCategoriesByDimension } from './getCbsCategoriesByDimensionPromise'
import { existing } from '../helpers/helpers'

const defaultToRoot = id => (existing(id) ? id : 'root')

const groupByDimensionKey = groupBy(({ DimensionKey }) =>
  defaultToRoot(DimensionKey)
)

const getArrayFromMap = id => map => get(id)(map) || []

const groupByParentID = groupBy(({ ParentID }) => defaultToRoot(ParentID))
const groupByCategoryGroupID = groupBy(({ CategoryGroupID }) =>
  defaultToRoot(CategoryGroupID)
)

const mapCategoryGroup = ({
  cbsCategoriesByGroupID,
  cbsCategoryGroupsByParentId,
}) => ({ ID, DimensionKey, Title }: CbsCategoryGroup): CategoryGroup => ({
  id: ID,
  title: Title,
  dimensionKey: DimensionKey,
  categories: getArrayFromMap(ID)(cbsCategoriesByGroupID).map(({ Key }) => Key),
  categoryGroups: getArrayFromMap(ID)(cbsCategoryGroupsByParentId).map(
    ({ ID }) => ID
  ),
})

const cbsCategoryGroupsByParentIdReducer = ({
  cbsCategoriesByGroupID,
  cbsCategoryGroupsByParentId,
}) => (memo, cbsCategoryGroup: CbsCategoryGroup) => {
  const categoryGroup = mapCategoryGroup({
    cbsCategoriesByGroupID,
    cbsCategoryGroupsByParentId,
  })(cbsCategoryGroup)

  if (
    categoryGroup.categories.length === 0 &&
    categoryGroup.categoryGroups.length === 0
  ) {
    return memo
  }

  return set(cbsCategoryGroup.ID, categoryGroup)(memo)
}

export type CbsCategoryGroupsByDimension = {
  [DimensionKey]: CbsCategoryGroups,
}

const cbsCategoryGroupsByDimensionReducer = (
  cbsCategoryGroupsByDimension: CbsCategoryGroupsByDimension
) => (memo, [dimensionKey, cbsCategories]: [DimensionKey, CbsCategories]) => {
  const cbsCategoriesByGroupID = groupByCategoryGroupID(cbsCategories)
  const cbsCategoryGroups = cbsCategoryGroupsByDimension[dimensionKey] || []
  const cbsCategoryGroupsByParentId = groupByParentID(cbsCategoryGroups)

  const categoryGroupsForDimension = {
    root: pickBy(existing)(
      mapCategoryGroup({
        cbsCategoriesByGroupID,
        cbsCategoryGroupsByParentId,
      })({ ID: 'root', DimensionKey: dimensionKey })
    ),
    ...cbsCategoryGroups.reduce(
      cbsCategoryGroupsByParentIdReducer({
        cbsCategoriesByGroupID,
        cbsCategoryGroupsByParentId,
      }),
      {}
    ),
  }

  return set(dimensionKey, categoryGroupsForDimension)(memo)
}

const reduceCbsCategoryGroups = ({
  cbsCategoryGroups,
  cbsCategoriesByDimension,
}) => {
  const cbsCategoryGroupsByDimension = groupByDimensionKey(cbsCategoryGroups)

  return reduce(
    cbsCategoryGroupsByDimensionReducer(cbsCategoryGroupsByDimension),
    {}
  )(Object.entries(cbsCategoriesByDimension))
}

export const getCategoryGroups = (id: DatasetId) => ({
  cbsCategoryGroups,
  cbsCategoriesByDimension,
}: {
  cbsCategoryGroups: CbsCategoryGroups,
  cbsCategoriesByDimension: CbsCategoriesByDimension,
}): CategoryGroups => {
  return {
    id,
    ...reduceCbsCategoryGroups({ cbsCategoryGroups, cbsCategoriesByDimension }),
  }
}
