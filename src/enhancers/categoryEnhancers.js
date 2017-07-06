import { connect } from 'react-redux'
import {
  categoriesGetInConnector,
  categoryGroupsGetInConnector,
  selectedCategoryConnector,
} from '../connectors/categoryConnectors'
import { configGetInConnector } from '../connectors/configConnectors'
import { configChangeHandlersEnhancer } from './configEnhancers'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'
import { mapDispatchToProps } from '../connectors/actionConnectors'
import { compose } from 'recompose'
import { isAccordion, accordionEnhancer } from './accordionEnhancer'
import { get } from '../helpers/getset'

export const categoryEnhancer = compose(
  connect((state, { dimensionKey, categoryKey }) => {
    const category = categoriesGetInConnector([dimensionKey, categoryKey])(
      state
    )
    const value = configGetInConnector(['categoryKeys', dimensionKey, 0])(state)

    return {
      title: category.title,
      inputValue: category.key,
      name: `${dimensionKey}-categoryKey`,
      multiValue: true,
      replaceValue: true,
      keyPath: ['categoryKeys', dimensionKey],
      value,
      datasetId: activeDatasetGetIdConnector(state),
    }
  }, mapDispatchToProps),
  configChangeHandlersEnhancer
)

export const categoryGroupEnhancer = compose(
  connect((state, { dimensionKey, categoryGroupId }) => {
    const props = categoryGroupsGetInConnector([dimensionKey, categoryGroupId])(
      state
    )
    const { selectedCategory } = selectedCategoryConnector(dimensionKey)(state)
    const parentGroupIds = get('parentGroupIds')(selectedCategory) || []
    const includesSelection = parentGroupIds.includes(categoryGroupId)
    return {
      asAccordion: isAccordion({
        id: categoryGroupId,
        lists: [props.categories],
      }),
      includesSelection,
      ...props,
    }
  }),
  accordionEnhancer
)
