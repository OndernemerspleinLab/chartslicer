import { dimensionsGetConnector } from '../connectors/dimensionConnectors'
import { connect } from 'react-redux'

export const dimensionForKeyEnhancer = connect((state, { dimensionKey }) => {
	const dimension = dimensionsGetConnector(dimensionKey)(state)

	return dimension || {}
})

export const dimensionInputEnhancer = connect((state, { dimensionKey }) => {
	const dimension = dimensionsGetConnector(dimensionKey)(state)

	return {
		replaceValue: true,
		multiValue: false,
		inputValue: dimensionKey,
		keyPath: ['topicKeys'],
		value: dimensionKey,
		children: dimension.title,
	}
})
