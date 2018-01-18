import {
	getActiveSubstate,
	pickFromActiveSubstate,
	mapFromActiveSubstate,
	getFromActiveSubstate,
	getInFromActiveSubstate,
} from './connectorHelpers'
import { getIn } from '../helpers/getset'

// GETTERS
export const configConnector = getActiveSubstate('config')

export const configGetConnector = getFromActiveSubstate(configConnector)

export const configGetInConnector = getInFromActiveSubstate(configConnector)

export const configPickConnector = pickFromActiveSubstate(configConnector)

export const configMapConnector = mapFromActiveSubstate(configConnector)

export const multiDimensionConnector = configPickConnector(['multiDimension'])

export const topicLabelAliasConnector = ({ key }) => state => {
	return getIn(['labelAliases', `topic/${key}`])(configConnector(state))
}
export const categoryLabelAliasConnector = ({ key, dimensionKey }) => state => {
	return getIn(['labelAliases', `category/${dimensionKey}/${key}`])(
		configConnector(state),
	)
}
export const labelAliasConnector = aliasType => {
	switch (aliasType) {
		case 'category':
			return categoryLabelAliasConnector

		case 'topic':
			return topicLabelAliasConnector
		default:
			throw new Error(`Invalid aliasType: ${aliasType}`)
	}
}
