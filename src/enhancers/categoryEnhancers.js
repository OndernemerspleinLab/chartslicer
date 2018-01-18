import { connect } from 'react-redux'
import {
	categoriesGetInConnector,
	categoryGroupsGetInConnector,
	selectedCategoriesConnector,
} from '../connectors/categoryConnectors'
import {
	configGetInConnector,
	multiDimensionConnector,
	categoryLabelAliasConnector,
} from '../connectors/configConnectors'
import { configChangeHandlersEnhancer } from './configEnhancers'
import { activeDatasetGetIdConnector } from '../connectors/activeDatasetIdConnector'
import { mapDispatchToProps } from '../connectors/actionConnectors'
import { compose } from 'recompose'
import { isAccordion, accordionEnhancer } from './accordionEnhancer'
import { get } from '../helpers/getset'
import { flatten } from 'lodash/fp'
import { maxDimensions } from '../config'

export const categoryEnhancer = compose(
	connect((state, { dimensionKey, categoryKey }) => {
		const category = categoriesGetInConnector([dimensionKey, categoryKey])(
			state,
		)
		const { multiDimension } = multiDimensionConnector(state)
		const isMultiDimension = multiDimension === dimensionKey
		const value = configGetInConnector(['categoryKeys', dimensionKey])(state)
		const alias = categoryLabelAliasConnector({
			dimensionKey,
			key: categoryKey,
		})(state)

		return {
			isMultiDimension,
			title: category.title,
			inputValue: category.key,
			name: `${dimensionKey}-categoryKey`,
			multiValue: true,
			replaceValue: !isMultiDimension,
			keyPath: ['categoryKeys', dimensionKey],
			value,
			alias,
			maxLength: maxDimensions,
			datasetId: activeDatasetGetIdConnector(state),
		}
	}, mapDispatchToProps),
	configChangeHandlersEnhancer,
)

export const categoryGroupEnhancer = compose(
	connect((state, { dimensionKey, categoryGroupId }) => {
		const props = categoryGroupsGetInConnector([dimensionKey, categoryGroupId])(
			state,
		)
		const { selectedCategories = [] } = selectedCategoriesConnector(
			dimensionKey,
		)(state)
		const parentGroupIds = flatten(
			selectedCategories.map(
				selectedCategory => get('parentGroupIds')(selectedCategory) || [],
			),
		)
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
	accordionEnhancer,
)
