import { getIn } from '../helpers/getset'
import { activeDatasetGetIdConnector } from './activeDatasetIdConnector'

export const activeDatasetGetQueryConnectorFor = activeDatasetId => state => {
	return getIn(['activeDatasetQueries', activeDatasetId])(state)
}
export const activeDatasetGetQueryConnector = state => {
	const activeDatasetId = activeDatasetGetIdConnector(state)
	return activeDatasetGetQueryConnectorFor(activeDatasetId)(state)
}
export const activeDatasetQueryConnector = state => {
	return { activeDatasetQuery: activeDatasetGetQueryConnector(state) }
}
