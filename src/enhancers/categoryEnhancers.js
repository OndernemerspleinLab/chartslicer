import { connect } from 'react-redux'
import { merge } from '../helpers/getset'
import {
  categoriesGetInConnector,
  categoryGroupsGetInConnector,
} from '../connectors/categoryConnectors'
import { configGetInConnector } from '../connectors/configConnectors'

export const categoryEnhancer = connect(
  (state, { dimensionKey, categoryKey }) => {
    const category = categoriesGetInConnector([dimensionKey, categoryKey])(
      state
    )
    const value = configGetInConnector(['categoryKeys', dimensionKey, 0])(state)

    return merge(category)({
      inputValue: category.key,
      name: `${dimensionKey}-categoryKey`,
      multiValue: true,
      replaceValue: true,
      keyPath: ['categoryKeys', dimensionKey],
      value,
    })
  }
)

export const categoryGroupEnhancer = connect(
  (state, { dimensionKey, categoryGroupId }) => {
    return categoryGroupsGetInConnector([dimensionKey, categoryGroupId])(state)
  }
)