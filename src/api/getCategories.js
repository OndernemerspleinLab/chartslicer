// @flow
import { reduce } from 'lodash/fp'
import type {
	Categories,
	Category,
	DatasetId,
	DimensionKey,
	CategoryGroups,
	CategoryGroupsForDimension,
	CategoryGroupId,
} from '../store/stateShape'
import type { CbsCategoriesByDimension } from './getCbsCategoriesByDimensionPromise'
import type { CbsCategory, CbsCategories } from './apiShape'
import { set, getIn, get } from '../helpers/getset'
import { existing } from '../helpers/helpers'

const getParentCategoryGroups = ({
	parentId,
	categoryGroupsForDimension,
}: {
	parentId: ?CategoryGroupId,
	categoryGroupsForDimension: CategoryGroupsForDimension,
}): CategoryGroupId[] => {
	const memo = []
	let nextParentId = parentId

	while (existing(nextParentId)) {
		memo.push(((nextParentId: any): CategoryGroupId))

		nextParentId = getIn([nextParentId, 'parentId'])(categoryGroupsForDimension)
	}

	memo.push('root')

	return memo
}

const mapCategory = ({
	dimensionKey,
	categoryGroupsForDimension,
}: {
	dimensionKey: DimensionKey,
	categoryGroupsForDimension: CategoryGroupsForDimension,
}) => ({ Key, Title, CategoryGroupID }: CbsCategory): Category => ({
	dimensionKey: dimensionKey,
	key: Key,
	title: Title,
	parentGroupIds: getParentCategoryGroups({
		parentId: CategoryGroupID,
		categoryGroupsForDimension,
	}),
})
const categoriesForDimensionReducer = ({
	dimensionKey,
	categoryGroupsForDimension,
}) => (memo, cbsCategory) =>
	set(
		cbsCategory.Key,
		mapCategory({ dimensionKey, categoryGroupsForDimension })(cbsCategory),
	)(memo)

const reduceCategoriesForDimension = categoryGroups => (
	memo,
	[dimensionKey, cbsCategoriesByDimension]: [DimensionKey, CbsCategories],
) => {
	return set(
		dimensionKey,
		cbsCategoriesByDimension.reduce(
			categoriesForDimensionReducer({
				dimensionKey,
				categoryGroupsForDimension: get(dimensionKey)(categoryGroups),
			}),
			{},
		),
	)(memo)
}
const reduceCbsCategoriesByDimension = ({
	cbsCategoriesByDimension,
	categoryGroups,
}) =>
	reduce(reduceCategoriesForDimension(categoryGroups), {})(
		Object.entries(cbsCategoriesByDimension),
	)

export const getCategories = (id: DatasetId) => ({
	cbsCategoriesByDimension,
	categoryGroups,
}: {
	cbsCategoriesByDimension: CbsCategoriesByDimension,
	categoryGroups: CategoryGroups,
}): Categories => {
	return {
		id,
		...reduceCbsCategoriesByDimension({
			cbsCategoriesByDimension,
			categoryGroups,
		}),
	}
}
