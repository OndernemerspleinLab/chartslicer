import {
  getActiveSubstate,
  mapFromActiveSubstate,
  getInFromActiveSubstate,
} from './connectorHelpers'
import { visibleDatasetInfoConnector } from './visibleDatasetQueryConnector'
import type { DimensionKey } from '../store/stateShape'
import { configGetInConnector } from './configConnectors'
import { orderedDimensionsConnector } from './dimensionConnectors'
import { set } from '../helpers/getset'

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

  const categories = categoryEntries.map(([dimensionKey, [categoryKey]]) => {
    return categoriesGetInConnector([dimensionKey, categoryKey])(state)
  })

  return { categories }
}

export const selectedCategoriesConnector = (dimensionKey: DimensionKey) => (
  state: State
) => {
  const categoryKeys = configGetInConnector(['categoryKeys', dimensionKey])(
    state
  )

  return {
    selectedCategories: categoryKeys.map(categoryKey =>
      categoriesGetInConnector([dimensionKey, categoryKey])(state)
    ),
  }
}

const allSelectedCategoriesReducer = (state: State) => (memo, dimensionKey) => {
  const { selectedCategories } = selectedCategoriesConnector(dimensionKey)(
    state
  )

  return set(dimensionKey, selectedCategories)(memo)
}

export const allSelectedCategoriesConnector = (state: State) => {
  const { dimensionKeys } = orderedDimensionsConnector(state)

  return {
    selectedCategories: dimensionKeys.reduce(
      allSelectedCategoriesReducer(state),
      {}
    ),
  }
}
