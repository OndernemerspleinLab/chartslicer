import { mapDispatchToProps } from '../connectors/actionConnectors'
import { withHandlers, compose } from 'recompose'
import { existing } from '../helpers/helpers'
import { activeDatasetIdConnector } from '../connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'
import { multiDimensionConnector } from '../connectors/configConnectors'

export const configChangeHandlersEnhancer = withHandlers({
	onChange: ({
		activeDatasetId,
		keyPath,
		configChanged,
		inputValue,
		multiValue,
		replaceValue,
		min,
		max,
		maxLength,
		type,
	}) => event => {
		const value = existing(inputValue) ? inputValue : event.currentTarget.value

		// const value = minMaxValue({ fieldValue, min, max })

		configChanged({
			keyPath,
			value,
			activeDatasetId,
			multiValue,
			replaceValue,
			maxLength,
		})
	},
})

export const configChangeEnhancer = compose(
	connect(activeDatasetIdConnector, mapDispatchToProps),
	configChangeHandlersEnhancer,
)

const multiDimensionOptionConnector = state => {
	const { multiDimension } = multiDimensionConnector(state)
	const { activeDatasetId } = activeDatasetIdConnector(state)

	return {
		value: multiDimension,
		activeDatasetId,
	}
}

export const multiDimensionOptionChangeHandlersEnhancer = withHandlers({
	onChange: ({
		activeDatasetId,
		multiDimensionChanged,
		inputValue,
	}) => event => {
		const newValue = event.target.checked ? inputValue : false

		multiDimensionChanged({
			multiDimension: newValue,
			activeDatasetId,
		})
	},
})

export const multiDimensionOptionEnhancer = compose(
	connect(multiDimensionOptionConnector, mapDispatchToProps),
	multiDimensionOptionChangeHandlersEnhancer,
)
