// @flow
import { groupBy, reduce } from 'lodash/fp'
import type {
  DatasetId,
  DimensionKey,
  CategoryGroups,
  CategoryGroup,
} from '../store/stateShape'
import type { CbsCategoryGroups, CbsCategoryGroup } from './apiShape'
import { set, get } from '../getset'
import type { CbsCategoriesByDimension } from './getCbsCategoriesByDimensionPromise'
import { existing } from '../helpers'

const defaultToRoot = id => (existing(id) ? id : 'root')

const groupByDimensionKey = groupBy(({ DimensionKey }) =>
  defaultToRoot(DimensionKey)
)

const getArrayFromMap = id => map => get(defaultToRoot(id))(map) || []

const groupByParentID = groupBy(({ ParentID }) => defaultToRoot(ParentID))
const groupByCategoryGroupID = groupBy(({ CategoryGroupID }) => CategoryGroupID)

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

  return set(cbsCategoryGroup.ID, categoryGroup)(memo)
}

const cbsCategoryGroupsByDimensionReducer = (
  cbsCategoriesByDimension: CbsCategoriesByDimension
) => (
  memo,
  [dimensionKey, cbsCategoryGroups]: [DimensionKey, CbsCategoryGroups]
) => {
  const cbsCategoriesByGroupID = groupByCategoryGroupID(
    cbsCategoriesByDimension[dimensionKey]
  )
  const cbsCategoryGroupsByParentId = groupByParentID(cbsCategoryGroups)

  const categoryGroupsForDimension = cbsCategoryGroups.reduce(
    cbsCategoryGroupsByParentIdReducer({
      cbsCategoriesByGroupID,
      cbsCategoryGroupsByParentId,
    }),
    {}
  )

  return set(dimensionKey, categoryGroupsForDimension)(memo)
}

const reduceCbsCategoryGroups = ({
  cbsCategoryGroups,
  cbsCategoriesByDimension,
}) => {
  const cbsCategoryGroupsByDimension = Object.entries(
    groupByDimensionKey(cbsCategoryGroups)
  )

  return reduce(
    cbsCategoryGroupsByDimensionReducer(cbsCategoriesByDimension),
    {}
  )(cbsCategoryGroupsByDimension)
}

export const getCategoryGroups = (id: DatasetId) => ({
  cbsCategoryGroups,
  cbsCategoriesByDimension,
}: {
  cbsCategoryGroups: CbsCategoryGroups,
  cbsCategoriesByDimension: CbsCategoriesByDimension,
}): CategoryGroups => ({
  id,
  ...reduceCbsCategoryGroups({ cbsCategoryGroups, cbsCategoriesByDimension }),
})
