import {
  getActiveSubstate,
  mapFromActiveSubstate,
  getInFromActiveSubstate,
} from './connectorHelpers'
import { visibleDatasetInfoConnector } from './visibleDatasetQueryConnector'

export const categoriesConnector = getActiveSubstate('categories')

export const categoriesGetInConnector = getInFromActiveSubstate(
  categoriesConnector
)

export const categoriesMapConnector = mapFromActiveSubstate(categoriesConnector)

export const categoryGroupsConnector = getActiveSubstate('categoryGroups')

export const categoryGroupsGetInConnector = getInFromActiveSubstate(
  categoryGroupsConnector
)

export const categoryGroupsMapConnector = mapFromActiveSubstate(
  categoryGroupsConnector
)

export const visibleCategoriesConnector = (state: State) => {
  const visibleDatasetInfo = visibleDatasetInfoConnector(state)

  const categoryEntries = Object.entries(visibleDatasetInfo.categoryKeys)

  const categories =
    categoryEntries.map(([dimensionKey, [categoryKey]]) => {
      return categoriesGetInConnector([dimensionKey, categoryKey])(state)
    }) || []

  return { categories }
}
